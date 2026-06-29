import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CreatePostBox from "../components/posts/CreatePostBox";
import PostCard from "../components/posts/PostCard";
import PostSkeleton from "../components/common/PostSkeleton";
import EmptyState from "../components/common/EmptyState";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const { data: posts, loading, error, refetch } = useFetch("/api/posts/");
  const [localPosts, setLocalPosts] = useState(null);

  const displayPosts = localPosts !== null ? localPosts : posts?.results || posts || [];

  const handlePostCreated = (newPost) => {
    setLocalPosts((prev) => {
      const base = prev !== null ? prev : posts?.results || posts || [];
      return [newPost, ...base];
    });
  };

  const handlePostDelete = (postId) => {
    setLocalPosts((prev) => {
      const base = prev !== null ? prev : posts?.results || posts || [];
      return base.filter((p) => p.id !== postId);
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main" style={{ paddingTop: 0 }}>
        <Navbar />
        <div style={{ paddingTop: "var(--navbar-height)" }}>
          <div className="page-container">
            <div style={{ marginBottom: 24, paddingTop: 24 }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}
              >
                Your Feed
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Stay connected with your network on Pulse
              </p>
            </div>

            <CreatePostBox onPostCreated={handlePostCreated} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "24px 0 20px",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                Latest Posts
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <PostSkeleton count={3} />
              </div>
            )}

            {error && (
              <EmptyState
                emoji="⚡"
                title="Couldn't load the feed"
                description="Check your connection and try again."
                action={
                  <button
                    onClick={refetch}
                    className="btn-hover-lift"
                    style={{
                      marginTop: 12,
                      padding: "10px 24px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--accent-gradient)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                }
              />
            )}

            {!loading && !error && displayPosts.length === 0 && (
              <EmptyState
                icon={Sparkles}
                title="Your feed is empty"
                description="Follow people or create your first post to get started!"
                action={
                  <Link
                    to="/create"
                    className="btn-hover-lift"
                    style={{
                      marginTop: 12,
                      display: "inline-flex",
                      padding: "10px 24px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--accent-gradient)",
                      color: "#fff",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Create your first post
                  </Link>
                }
              />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {displayPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  onPostUpdate={refetch}
                  onPostDelete={handlePostDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
