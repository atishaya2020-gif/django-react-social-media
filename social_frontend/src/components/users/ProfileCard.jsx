import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { getMediaUrl } from "../../utils/media";
import { isFollowingProfile, setFollowingProfile } from "../../utils/following";

const ProfileCard = ({ profile, onFollowUpdate }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(() => isFollowingProfile(profile.id));
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile.followers_count || 0);

  const isOwn = user?.profileId === profile.id;

  const handleFollow = async () => {
    if (isOwn) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/profiles/${profile.id}/follow/`);
      const nextFollowing = res.data.message === "Followed";
      setFollowing(nextFollowing);
      setFollowingProfile(profile.id, nextFollowing);
      setFollowersCount((c) => (nextFollowing ? c + 1 : Math.max(0, c - 1)));
      toast.success(nextFollowing ? "Followed!" : "Unfollowed");
      if (onFollowUpdate) onFollowUpdate(profile.id, nextFollowing);
    } catch {
      toast.error("Failed to follow.");
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = getMediaUrl(profile.profile_image);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transition: "var(--transition)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
        e.currentTarget.style.boxShadow = "var(--shadow-glow-violet)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Link to={`/profile/${profile.id}`} style={{ textDecoration: "none" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: avatarUrl ? "none" : "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#fff",
            border: "3px solid var(--border-accent)",
            boxShadow: "var(--shadow-glow-violet)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profile.user?.username}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            profile.user?.username?.[0]?.toUpperCase()
          )}
        </div>
      </Link>

      <div style={{ textAlign: "center" }}>
        <Link
          to={`/profile/${profile.id}`}
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          {profile.user?.username}
        </Link>
        {profile.bio && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.83rem",
              marginTop: 6,
              lineHeight: 1.5,
              maxWidth: 180,
            }}
          >
            {profile.bio}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{followersCount}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Followers</p>
        </div>
        <div style={{ width: 1, background: "var(--border)" }} />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{profile.following_count || 0}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Following</p>
        </div>
      </div>

      {!isOwn && (
        <button
          id={`follow-btn-${profile.id}`}
          onClick={handleFollow}
          disabled={loading}
          className="btn-hover-lift"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: "var(--radius-md)",
            background: following ? "var(--bg-glass)" : "var(--accent-gradient)",
            border: following ? "1px solid var(--border-accent)" : "none",
            color: following ? "var(--accent-violet-light)" : "#fff",
            fontWeight: 600,
            fontSize: "0.88rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: following ? "none" : "0 4px 16px rgba(124,58,237,0.3)",
          }}
        >
          {loading ? "..." : following ? "Following ✓" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
