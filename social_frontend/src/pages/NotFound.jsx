import { Link } from "react-router-dom";
import { PulseLogo } from "../components/layout/Navbar";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: 24,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, animation: "fadeIn 0.6s ease forwards" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 32,
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <PulseLogo size={64} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <span
            style={{
              fontSize: "8rem",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
              display: "block",
            }}
          >
            404
          </span>
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>Signal lost</h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            maxWidth: 380,
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          This page doesn&apos;t exist in our network. It might have been moved, deleted, or never
          connected.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 36 }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 2 ? 12 : 8,
                height: i === 2 ? 12 : 8,
                borderRadius: "50%",
                background: i % 2 === 0 ? "var(--accent-violet)" : "var(--accent-cyan)",
                opacity: i === 2 ? 1 : 0.5,
                animation: `pulse-glow ${1.5 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/"
            className="btn-hover-lift"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: "var(--radius-full)",
              background: "var(--accent-gradient)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}
          >
            ⌂ Back to Home
          </Link>
          <Link
            to="/explore"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-glass)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
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
            ✦ Explore Pulse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
