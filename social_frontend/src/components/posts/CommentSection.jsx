import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const CommentSection = ({ postId, initialComments = [] }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/comments/", {
        post: postId,
        text: text.trim(),
      });
      setComments((prev) => [...prev, data]);
      setText("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        borderTop: "1px solid var(--border)",
        background: "rgba(0,0,0,0.2)",
        padding: "16px 20px",
        animation: "fadeIn 0.25s ease forwards",
      }}
    >
      {comments.length > 0 && (
        <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                animation: "fadeIn 0.3s ease forwards",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {comment.user?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border)",
                  borderRadius: "0 var(--radius-md) var(--radius-md) var(--radius-md)",
                  padding: "8px 12px",
                  flex: 1,
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "var(--accent-violet-light)",
                    marginBottom: 3,
                  }}
                >
                  {comment.user?.username}
                </p>
                <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  {comment.text}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>
                  {formatTime(comment.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          No comments yet. Be the first to comment!
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {user?.username?.[0]?.toUpperCase() || "?"}
        </div>
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="input-base"
            style={{ flex: 1, padding: "9px 14px", fontSize: "0.88rem" }}
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="btn-hover-lift"
            style={{
              padding: "9px 18px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-gradient)",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: submitting || !text.trim() ? "not-allowed" : "pointer",
              opacity: submitting || !text.trim() ? 0.5 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {submitting ? "..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
