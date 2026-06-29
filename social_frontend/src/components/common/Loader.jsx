import { PulseLogo } from "../layout/Navbar";

const Loader = ({ fullscreen = false, size = 40 }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: "3px solid rgba(124, 58, 237, 0.15)",
    borderTop: "3px solid var(--accent-violet)",
    borderRight: "3px solid var(--accent-cyan)",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  };

  if (fullscreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          gap: 16,
          zIndex: 9999,
        }}
      >
        <div style={{ animation: "float 2s ease-in-out infinite" }}>
          <PulseLogo size={48} />
        </div>
        <div style={spinnerStyle} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
          Loading Pulse...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <div style={spinnerStyle} />
    </div>
  );
};

export default Loader;
