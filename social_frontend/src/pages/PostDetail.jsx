import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PostSkeleton from "../components/common/PostSkeleton";
import useFetch from "../hooks/useFetch";
import { getMediaUrl } from "../utils/media";
import CommentSection from "../components/posts/CommentSection";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";
import { ImagePreviewTrigger } from "../components/common/ImageLightbox";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PostDetail = () => {
  const { id } = useParams();
  const { getProfileId } = useAuth();
  const navigate = useNavigate();
  const { data: post, loading, error } = useFetch(`/api/posts/${id}/`);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [postKey, setPostKey] = useState(null);

  if (post && postKey !== post.id) {
    setPostKey(post.id);
    setLikesCount(post.likes_count || 0);
    setLiked(post.is_liked || false);
  }

  const handleLike = async () => {
    try {
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 400);
      await api.post(`/api/posts/${id}/like/`);
      setLiked((prev) => {
        const next = !prev;
        setLikesCount((c) => (next ? c + 1 : c - 1));
        return next;
      });
    } catch {
      toast.error("Failed to like post.");
    }
  };

  const imageUrl = getMediaUrl(post?.image);
  const profileId = post ? getProfileId(post.user?.id) : null;
  const profileLink = profileId ? `/profile/${profileId}` : "#";

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main" style={{ paddingTop: 0 }}>
        <Navbar />
        <div style={{ paddingTop: "var(--navbar-height)" }}>
          <div className="page-container">
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-glass)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.88rem",
                marginBottom: 20,
                marginTop: 24,
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-accent)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ← Back
            </button>

            {loading && <PostSkeleton count={1} />}
            {error && (
              <div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
                Post not found.
              </div>
            )}

            {post && (
              <article
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  animation: "fadeIn 0.4s ease forwards",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 24px" }}>
                  <Link to={profileLink}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "var(--accent-gradient)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#fff",
                        border: "2px solid var(--border-accent)",
                      }}
                    >
                      {post.user?.username?.[0]?.toUpperCase()}
                    </div>
                  </Link>
                  <div>
                    <Link
                      to={profileLink}
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        textDecoration: "none",
                        color: "var(--text-primary)",
                      }}
                    >
                      {post.user?.username}
                    </Link>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>
                      {formatTime(post.created_at)}
                    </p>
                  </div>
                </div>

                {post.caption && (
                  <p
                    style={{
                      padding: "0 24px 20px",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      color: "var(--text-primary)",
                    }}
                  >
                    {post.caption}
                  </p>
                )}

                {imageUrl && (
                  <ImagePreviewTrigger src={imageUrl} alt="Post">
                    <img src={imageUrl} alt="Post" style={{ width: "100%", display: "block" }} />
                  </ImagePreviewTrigger>
                )}

                <div
                  style={{
                    padding: "16px 20px",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={handleLike}
                    className={likeAnimating ? "like-pop" : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 18px",
                      borderRadius: "var(--radius-full)",
                      background: liked ? "var(--danger-dim)" : "var(--bg-glass)",
                      border: liked ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border)",
                      color: liked ? "var(--danger)" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      transition: "var(--transition)",
                    }}
                  >
                    <Heart size={18} fill={liked ? "currentColor" : "none"} />
                    {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                  </button>
                </div>

                <CommentSection postId={post.id} initialComments={post.comments || []} />
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
