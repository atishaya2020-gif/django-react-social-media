import { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PostCard from "../components/posts/PostCard";
import ProfileCard from "../components/users/ProfileCard";
import PostSkeleton from "../components/common/PostSkeleton";
import EmptyState from "../components/common/EmptyState";
import useFetch from "../hooks/useFetch";

const Explore = () => {
  const [search, setSearch] = useState("");
  const postsUrl = search.trim()
    ? `/api/posts/?search=${encodeURIComponent(search.trim())}`
    : "/api/posts/";

  const { data: postsData, loading, error, refetch } = useFetch(postsUrl);
  const { data: profilesData, loading: profilesLoading } = useFetch("/api/profiles/");

  const allPosts = postsData?.results || postsData || [];

  const filteredProfiles = useMemo(() => {
    const profiles = profilesData?.results || profilesData || [];
    if (!search.trim()) return profiles.slice(0, 6);
    const q = search.toLowerCase();
    return profiles.filter(
      (p) =>
        p.user?.username?.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q)
    );
  }, [profilesData, search]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main" style={{ paddingTop: 0 }}>
        <Navbar />
        <div style={{ paddingTop: "var(--navbar-height)" }}>
          <div className="page-container-wide" style={{ paddingTop: 32 }}>
            <div style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}
              >
                Explore
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Discover posts and people across Pulse
              </p>
            </div>

            <div style={{ position: "relative", marginBottom: 32 }}>
              <Search
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
                size={18}
              />
              <input
                id="explore-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts and people..."
                className="input-base"
                style={{ paddingLeft: 44 }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="explore-grid">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    {search ? `Results for "${search}"` : "All Posts"}
                  </h2>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--accent-violet-dim)",
                      border: "1px solid var(--border-accent)",
                      fontSize: "0.78rem",
                      color: "var(--accent-violet-light)",
                      fontWeight: 600,
                    }}
                  >
                    {allPosts.length} posts
                  </span>
                </div>

                {loading && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <PostSkeleton count={2} />
                  </div>
                )}

                {error && (
                  <EmptyState
                    emoji="⚡"
                    title="Failed to load posts"
                    description="Something went wrong. Please try again."
                    action={
                      <button
                        onClick={refetch}
                        className="btn-hover-lift"
                        style={{
                          marginTop: 12,
                          padding: "8px 20px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--accent-gradient)",
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Retry
                      </button>
                    }
                  />
                )}

                {!loading && !error && allPosts.length === 0 && (
                  <EmptyState
                    icon={Search}
                    title={search ? "No results found" : "No posts yet"}
                    description={
                      search
                        ? `Nothing matched "${search}". Try a different search.`
                        : "Be the first to share something with the community."
                    }
                  />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {allPosts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </div>

              <div style={{ position: "sticky", top: "calc(var(--navbar-height) + 24px)" }}>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Users size={16} /> People on Pulse
                </h2>

                {profilesLoading && (
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-xl)",
                      padding: 20,
                    }}
                  >
                    <PostSkeleton count={1} />
                  </div>
                )}

                {!profilesLoading && filteredProfiles.length === 0 && (
                  <EmptyState
                    icon={Users}
                    title="No users found"
                    description={search ? "Try a different search term." : "No profiles to show yet."}
                  />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
