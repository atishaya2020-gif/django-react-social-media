import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../../api/axios";
import CommentSection from "./CommentSection";
import useAuth from "../../hooks/useAuth";
import { getMediaUrl } from "../../utils/media";
import { ImagePreviewTrigger } from "../common/ImageLightbox";

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const PostCard = ({ post, onPostUpdate, onPostDelete, index = 0 }) => {
  const { user, getProfileId } = useAuth();
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);
  console.log("Logged in user:", user);
  console.log("Post owner:", post.user);
  const isOwner = user?.id === post.user?.id;
  const profileId = getProfileId(post.user?.id);
  const profileLink = profileId ? `/profile/${profileId}` : "#";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async () => {
    try {
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 400);
      await api.post(`/api/posts/${post.id}/like/`);
      setLiked((prev) => {
        const newLiked = !prev;
        setLikesCount((c) => (newLiked ? c + 1 : c - 1));
        return newLiked;
      });
    } catch {
      toast.error("Failed to like post.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/posts/${post.id}/`);
      toast.success("Post deleted");
      if (onPostDelete) onPostDelete(post.id);
      else if (onPostUpdate) onPostUpdate();
    } catch {
      toast.error("Failed to delete post.");
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  const imageUrl = getMediaUrl(post.image);
  const avatarLetter = post.user?.username?.[0]?.toUpperCase() || "?";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        transition: "var(--transition)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-accent)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px" }}>
        <Link to={profileLink} style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "var(--shadow-glow-violet)",
            }}
          >
            {avatarLetter}
          </div>
        </Link>
        <div style={{ flex: 1 }}>
          <Link
            to={profileLink}
            style={{
              fontWeight: 600,
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
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              color: "var(--text-muted)",
              background: "transparent",
              padding: 8,
              borderRadius: "50%",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "var(--bg-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <MoreHorizontal size={20} />
          </button>
          {showMenu && isOwner && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: 6,
                minWidth: 140,
                boxShadow: "var(--shadow-md)",
                zIndex: 10,
                animation: "fadeIn 0.15s ease forwards",
              }}
            >
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  color: "var(--danger)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--danger-dim)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {post.caption && (
        <p
          style={{
            padding: "0 24px 16px",
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "var(--text-primary)",
          }}
        >
          {post.caption}
        </p>
      )}

      {imageUrl && (
        <ImagePreviewTrigger src={imageUrl} alt="Post">
          <div
            style={{
              width: "100%",
              maxHeight: 500,
              overflow: "hidden",
              background: "var(--bg-secondary)",
            }}
          >
            <img
              src={imageUrl}
              alt="Post"
              style={{ width: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </ImagePreviewTrigger>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px 24px",
          borderTop: imageUrl ? "1px solid var(--border)" : "none",
        }}
      >
        <button
          onClick={handleLike}
          className={likeAnimating ? "like-pop" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            background: liked ? "var(--danger-dim)" : "var(--bg-secondary)",
            color: liked ? "var(--danger)" : "var(--text-primary)",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            if (!liked) e.currentTarget.style.background = "var(--border)";
          }}
          onMouseLeave={(e) => {
            if (!liked) e.currentTarget.style.background = "var(--bg-secondary)";
          }}
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
          {likesCount > 0 && likesCount}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            background: showComments ? "var(--accent-violet-dim)" : "var(--bg-secondary)",
            color: showComments ? "var(--accent-violet-light)" : "var(--text-primary)",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            if (!showComments) e.currentTarget.style.background = "var(--border)";
          }}
          onMouseLeave={(e) => {
            if (!showComments) e.currentTarget.style.background = "var(--bg-secondary)";
          }}
        >
          <MessageCircle size={20} />
          {post.comments?.length > 0 && post.comments.length}
        </button>

        <div style={{ flex: 1 }} />

        <button
          style={{
            padding: 8,
            borderRadius: "50%",
            background: "transparent",
            color: "var(--text-muted)",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-secondary)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
            toast.success("Link copied!");
          }}
        >
          <Share2 size={20} />
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post.id} initialComments={post.comments || []} />
      )}
    </motion.article>
  );
};

export default PostCard;
