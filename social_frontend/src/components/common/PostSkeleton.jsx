import Skeleton from "react-loading-skeleton";

const PostSkeleton = ({ count = 2 }) => (
  <>
    {Array.from({ length: count }).map((_, n) => (
      <div
        key={n}
        style={{
          background: "var(--bg-card)",
          padding: 24,
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)",
          animation: "fadeIn 0.3s ease forwards",
          animationDelay: `${n * 0.08}s`,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <Skeleton circle width={42} height={42} />
          <div style={{ flex: 1 }}>
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={14} style={{ marginTop: 6 }} />
          </div>
        </div>
        <Skeleton count={2} style={{ marginBottom: 16 }} />
        <Skeleton height={220} borderRadius="var(--radius-lg)" />
      </div>
    ))}
  </>
);

export default PostSkeleton;
