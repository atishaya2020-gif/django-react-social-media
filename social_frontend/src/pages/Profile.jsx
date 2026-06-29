import { useParams } from "react-router-dom";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Ghost, UserPlus, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PostCard from "../components/posts/PostCard";
import EditProfileModal from "../components/users/EditProfileModal";
import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";
import { getMediaUrl } from "../utils/media";
import { isFollowingProfile, setFollowingProfile } from "../utils/following";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useFetch(
    `/api/profiles/${id}/`
  );
  const { data: postsData, loading: postsLoading } = useFetch("/api/posts/");

  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileKey, setProfileKey] = useState(null);

  if (profile && profileKey !== profile.id) {
    setProfileKey(profile.id);
    setFollowersCount(profile.followers_count || 0);
    setFollowing(isFollowingProfile(profile.id));
  }

  const isOwn = user?.profileId === Number(id);

  const allPosts = postsData?.results || postsData || [];
  const userPosts = allPosts.filter((p) => p.user?.id === profile?.user?.id);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const res = await api.post(`/api/profiles/${id}/follow/`);
      const nextFollowing = res.data.message === "Followed";
      setFollowing(nextFollowing);
      setFollowingProfile(id, nextFollowing);
      setFollowersCount((c) => (nextFollowing ? c + 1 : Math.max(0, c - 1)));
      toast.success(nextFollowing ? "Followed!" : "Unfollowed");
    } catch {
      toast.error("Failed to follow/unfollow.");
    }
    setFollowLoading(false);
  };

  const avatarUrl = getMediaUrl(profile?.profile_image);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main" style={{ paddingTop: 0 }}>
        <Navbar />
        <div style={{ paddingTop: "var(--navbar-height)" }}>
          <div className="page-container" style={{ paddingTop: 32 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                marginBottom: 32,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  height: 160,
                  background: "var(--accent-gradient)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(0,0,0,0.1) 0%, transparent 50%)",
                  }}
                />
              </div>

              <div style={{ padding: "0 32px 32px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginTop: -45,
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  {profileLoading ? (
                    <Skeleton
                      circle
                      width={100}
                      height={100}
                      style={{ border: "4px solid var(--bg-card)", zIndex: 2 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        border: "4px solid var(--bg-card)",
                        boxShadow: "var(--shadow-glow-violet)",
                        overflow: "hidden",
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profile?.user?.username}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        profile?.user?.username?.[0]?.toUpperCase()
                      )}
                    </div>
                  )}

                  {!profileLoading &&
                    (isOwn ? (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="btn-hover-lift"
                        style={{
                          padding: "10px 24px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-glass)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className="btn-hover-lift"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 24px",
                          borderRadius: "var(--radius-full)",
                          background: following ? "var(--bg-glass)" : "var(--accent-gradient)",
                          border: following ? "1px solid var(--border-accent)" : "none",
                          color: following ? "var(--accent-violet-light)" : "#fff",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          cursor: followLoading ? "not-allowed" : "pointer",
                          boxShadow: following ? "none" : "var(--shadow-glow-violet)",
                          opacity: followLoading ? 0.7 : 1,
                        }}
                      >
                        {following ? (
                          <>
                            <UserCheck size={18} /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} /> Follow
                          </>
                        )}
                      </button>
                    ))}
                </div>

                <div style={{ marginTop: 20 }}>
                  {profileLoading ? (
                    <>
                      <Skeleton width={200} height={32} />
                      <Skeleton width={300} height={20} style={{ marginTop: 12 }} />
                    </>
                  ) : (
                    <>
                      <h1
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          marginBottom: 8,
                        }}
                      >
                        {profile?.user?.username}
                      </h1>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          maxWidth: 500,
                        }}
                      >
                        {profile?.bio ||
                          (isOwn ? "Add a bio to tell people about yourself." : "No bio yet.")}
                      </p>
                    </>
                  )}

                  <div style={{ display: "flex", gap: 32, marginTop: 24, flexWrap: "wrap" }}>
                    {[
                      {
                        label: "Posts",
                        value: profileLoading ? <Skeleton width={40} /> : userPosts.length,
                      },
                      {
                        label: "Followers",
                        value: profileLoading ? <Skeleton width={40} /> : followersCount,
                      },
                      {
                        label: "Following",
                        value: profileLoading ? (
                          <Skeleton width={40} />
                        ) : (
                          profile?.following_count || 0
                        ),
                      },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p
                          style={{
                            fontWeight: 800,
                            fontSize: "1.3rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {stat.value}
                        </p>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: 20,
                color: "var(--text-secondary)",
              }}
            >
              Posts
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {postsLoading &&
                [1, 2].map((n) => (
                  <div
                    key={n}
                    style={{
                      background: "var(--bg-card)",
                      padding: 24,
                      borderRadius: "var(--radius-xl)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Skeleton circle width={42} height={42} />
                      <div style={{ flex: 1 }}>
                        <Skeleton width={120} height={20} />
                        <Skeleton width={80} height={14} />
                      </div>
                    </div>
                    <Skeleton count={2} style={{ marginBottom: 16 }} />
                    <Skeleton height={200} borderRadius="var(--radius-lg)" />
                  </div>
                ))}

              {!postsLoading && userPosts.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "64px 24px",
                    background: "var(--bg-card)",
                    border: "1px dashed var(--border-accent)",
                    borderRadius: "var(--radius-xl)",
                    color: "var(--text-muted)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "var(--bg-secondary)",
                      padding: 20,
                      borderRadius: "50%",
                      marginBottom: 16,
                    }}
                  >
                    <Ghost size={48} color="var(--text-muted)" />
                  </div>
                  <h3 style={{ color: "var(--text-primary)", fontSize: "1.2rem", marginBottom: 8 }}>
                    No posts yet
                  </h3>
                  <p>When {isOwn ? "you post" : "they post"}, it&apos;ll show up here.</p>
                </div>
              )}

              {!postsLoading &&
                userPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            refetchProfile();
          }}
        />
      )}
    </div>
  );
};

export default Profile;
