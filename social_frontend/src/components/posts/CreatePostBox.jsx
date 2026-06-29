import { useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { getMediaUrl } from "../../utils/media";

const CreatePostBox = ({ onPostCreated }) => {
  const { user } = useAuth();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef();

  const avatarUrl = getMediaUrl(user?.profileImage);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      const message = "Image must be smaller than 10 MB.";
      setError(message);
      toast.error(message);
      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      const message = "Only JPG, PNG and WEBP images are allowed.";
      setError(message);
      toast.error(message);
      e.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim() && !image) {
      const message = "Please add a caption or image.";
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("caption", caption);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await api.post(
        "/api/posts/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCaption("");
      removeImage();

      if (onPostCreated) {
        onPostCreated(data);
      }

      toast.success("Post shared successfully!");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.image?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to create post.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "20px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: avatarUrl ? "none" : "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
            border: "2px solid var(--border-accent)",
            overflow: "hidden",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            user?.username?.[0]?.toUpperCase() || "P"
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={`What's on your mind, ${user?.username || "friend"}?`}
            rows={3}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              resize: "none",
              lineHeight: 1.6,
              fontFamily: "var(--font)",
            }}
          />          {/* Image preview */}
          {preview && (
            <div
              style={{
                position: "relative",
                marginTop: 12,
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                }}
              />

              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.7)",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <p
              style={{
                color: "var(--danger)",
                fontSize: "0.82rem",
                marginTop: 8,
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-glass)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--border-accent)";
                e.currentTarget.style.color =
                  "var(--accent-violet-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--border)";
                e.currentTarget.style.color =
                  "var(--text-secondary)";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>

              Photo
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleImage}
            />

            <div style={{ flex: 1 }} />

            <button
              type="submit"
              disabled={
                submitting ||
                (!caption.trim() && !image)
              }
              style={{
                padding: "8px 24px",
                borderRadius: "var(--radius-full)",
                background: "var(--accent-gradient)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor:
                  submitting ||
                  (!caption.trim() && !image)
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  submitting ||
                  (!caption.trim() && !image)
                    ? 0.5
                    : 1,
                transition: "var(--transition)",
                boxShadow:
                  "0 4px 16px rgba(124,58,237,0.35)",
              }}
            >
              {submitting ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostBox;