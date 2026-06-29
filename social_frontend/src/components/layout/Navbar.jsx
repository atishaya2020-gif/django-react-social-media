import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useLayout } from "../../context/LayoutContext";
import { getMediaUrl } from "../../utils/media";

export const PulseLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="url(#pulse-glow)" opacity="0.4" />
    <path
      d="M12 32 L22 32 L28 14 L36 50 L42 32 L52 32"
      stroke="url(#pulse-grad)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0px 0px 8px rgba(6, 182, 212, 0.8))" }}
    />
    <circle cx="32" cy="32" r="4" fill="#ffffff" />
    <defs>
      <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <radialGradient id="pulse-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export const NexusLogo = PulseLogo;

const navLinks = [
  { path: "/", label: "Home", icon: "⌂" },
  { path: "/explore", label: "Explore", icon: "✦" },
  { path: "/create", label: "Create", icon: "＋" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarUrl = getMediaUrl(user?.profileImage);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--navbar-height)",
        background: "rgba(10, 10, 15, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px 0 24px",
        zIndex: 500,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          className="mobile-only"
          onClick={toggleSidebar}
          aria-label="Open menu"
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-md)",
            background: "var(--bg-glass)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Menu size={20} />
        </button>

        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <PulseLogo size={36} />
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Pulse
          </span>
        </Link>
      </div>

      <nav className="desktop-only" style={{ alignItems: "center", gap: 6 }}>
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.95rem",
                fontWeight: active ? 600 : 500,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--accent-violet-dim)" : "transparent",
                border: active ? "1px solid var(--accent-violet-dim)" : "1px solid transparent",
                transition: "var(--transition)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "var(--bg-glass)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ position: "relative" }} ref={menuRef}>
        <button
          id="navbar-user-menu"
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--bg-glass)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            padding: "6px 16px 6px 6px",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: avatarUrl ? "none" : "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              user?.username?.[0]?.toUpperCase() || "P"
            )}
          </div>
          <span
            className="desktop-only"
            style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-secondary)" }}
          >
            {user?.username || "Me"}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>▾</span>
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 8,
              minWidth: 200,
              boxShadow: "var(--shadow-glow-violet)",
              animation: "fadeIn 0.2s ease forwards",
              zIndex: 600,
            }}
          >
            {user?.profileId && (
              <Link
                to={`/profile/${user.profileId}`}
                onClick={() => setShowMenu(false)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-glass)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span>👤</span> My Profile
              </Link>
            )}

            <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: "none",
                color: "var(--danger)",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "var(--transition)",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--danger-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span>⎋</span> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
