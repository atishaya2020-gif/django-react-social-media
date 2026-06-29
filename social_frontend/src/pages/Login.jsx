import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { PulseLogo } from "../components/layout/Navbar";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid credentials. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg-primary)",
    }}>
      {/* Left panel — branding */}
      <div className="auth-split-left" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 100%)",
        borderRight: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          top: "20%",
          left: "10%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          bottom: "15%",
          right: "5%",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>
            <PulseLogo size={80} />
          </div>
          <h1 style={{
            fontSize: "3.2rem",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            marginBottom: 16,
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Pulse
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Connect in real time. Share your story, build your network, feel the pulse of your world.
          </p>

          {/* Feature tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 32 }}>
            {["✦ Share Posts", "❤️ Like & Comment", "◎ Follow Friends", "✦ Explore All"].map((tag) => (
              <span key={tag} style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-glass)",
                border: "1px solid var(--border)",
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="auth-split-right" style={{
        width: "min(480px, 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        animation: "fadeInLeft 0.5s ease forwards",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.03em" }}>
            Welcome back
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 36, fontSize: "0.95rem" }}>
            Sign in to continue your journey
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: "var(--danger-dim)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: 20,
              color: "var(--danger)",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                Username
              </label>
              <input
                id="login-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="input-base"
                autoComplete="username"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-base"
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                background: "var(--accent-gradient)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "var(--transition)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                marginTop: 4,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--accent-violet-light)",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = "var(--accent-violet-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "transparent"; }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
