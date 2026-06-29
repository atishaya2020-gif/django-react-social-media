import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import api from "../api/axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImage(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !image) {
      setError("Please add a caption or upload an image.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);
      const { data } = await api.post("/api/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post published!");
      navigate(`/posts/${data.id}`);
    } catch {
      setError("Failed to publish post. Try again.");
      toast.error("Failed to publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main" style={{ paddingTop: 0 }}>
        <Navbar />
        <div style={{ paddingTop: "var(--navbar-height)" }}>
          <div className="page-container" style={{ paddingTop: 32 }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              Create Post
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 28 }}>
              Share a moment with your network
            </p>

            <form onSubmit={handleSubmit}>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !preview && fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--accent-violet)" : preview ? "var(--border-accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-xl)",
                  padding: preview ? 0 : "48px 24px",
                  textAlign: "center",
                  cursor: preview ? "default" : "pointer",
                  background: dragOver
                    ? "var(--accent-violet-dim)"
                    : preview
                    ? "var(--bg-card)"
                    : "var(--bg-glass)",
                  transition: "var(--transition)",
                  marginBottom: 20,
                  overflow: "hidden",
                  minHeight: preview ? "auto" : 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: preview ? "flex-start" : "center",
                }}
              >
                {preview ? (
                  <div style={{ position: "relative", width: "100%" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: 400,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setPreview(null);
                      }}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(0,0,0,0.75)",
                        border: "none",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileRef.current.click();
                      }}
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: "rgba(0,0,0,0.75)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "var(--radius-md)",
                        padding: "6px 14px",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "var(--accent-violet-dim)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                        border: "1px solid var(--border-accent)",
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--accent-violet-light)">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                      </svg>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
                      Drop an image here
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>
                      or click to browse from your device
                    </p>
                    <span
                      style={{
                        padding: "8px 20px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-glass)",
                        border: "1px solid var(--border)",
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      JPG, PNG, GIF, WebP
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImage(e.target.files[0])}
              />

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 10,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  Caption
                </label>
                <textarea
                  id="create-post-caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write something captivating..."
                  rows={4}
                  className="input-base"
                  style={{ resize: "vertical", lineHeight: 1.7 }}
                />
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    marginTop: 6,
                    textAlign: "right",
                  }}
                >
                  {caption.length} characters
                </p>
              </div>

              {error && (
                <div
                  style={{
                    background: "var(--danger-dim)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 16px",
                    marginBottom: 20,
                    color: "var(--danger)",
                    fontSize: "0.88rem",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  id="publish-post-btn"
                  type="submit"
                  disabled={submitting || (!caption.trim() && !image)}
                  className="btn-hover-lift"
                  style={{
                    flex: 2,
                    padding: 13,
                    borderRadius: "var(--radius-md)",
                    background: "var(--accent-gradient)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: submitting || (!caption.trim() && !image) ? "not-allowed" : "pointer",
                    opacity: submitting || (!caption.trim() && !image) ? 0.5 : 1,
                    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                  }}
                >
                  {submitting ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid #fff",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      Publishing...
                    </span>
                  ) : (
                    "✦ Publish Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
