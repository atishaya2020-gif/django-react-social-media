import { useState, useRef } from "react";
import { Camera, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { getMediaUrl } from "../../utils/media";

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  const { updateUserProfile } = useAuth();
  const [bio, setBio] = useState(profile?.bio || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const existingAvatarUrl = getMediaUrl(profile?.profile_image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const res = await api.patch(`/api/profiles/${profile.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUserProfile(res.data);
      toast.success("Profile updated successfully!");
      onUpdate(res.data);
      onClose();
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Edit Profile</h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)", background: "transparent" }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "var(--bg-secondary)",
                position: "relative",
                overflow: "hidden",
                border: "2px dashed var(--border-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview || existingAvatarUrl ? (
                <img
                  src={imagePreview || existingAvatarUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Camera size={32} color="var(--text-muted)" />
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "var(--transition)",
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = 0;
                }}
              >
                <Camera size={24} />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <p style={{ marginTop: 12, color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Click to upload a new avatar
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-base"
              rows={4}
              placeholder="Tell us about yourself..."
              style={{ resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-hover-lift"
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-full)",
                background: "var(--accent-gradient)",
                color: "#fff",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading && <Loader size={18} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
