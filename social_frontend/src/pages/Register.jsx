import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { PulseLogo } from "../components/layout/Navbar";
import toast from "react-hot-toast";

const Register = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#10b981"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      await login(form.username, form.password);
      toast.success("Account created! Welcome to Pulse.");
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) setError(`Username: ${data.username[0]}`);
      else if (data?.email) setError(`Email: ${data.email[0]}`);
      else if (data?.password) setError(`Password: ${data.password[0]}`);
      else setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-primary)",
      padding: 24,
    }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", top: "-10%", left: "-10%" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", bottom: "-10%", right: "-5%" }} />
      </div>

      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "40px",
        boxShadow: "var(--shadow-lg), var(--shadow-glow-violet)",
        animation: "fadeIn 0.5s ease forwards",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>
            <PulseLogo size={52} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Join Pulse
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Create your account and connect with the world
          </p>
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 7, fontSize: "0.83rem", fontWeight: 500, color: "var(--text-secondary)" }}>Username</label>
            <input
              id="reg-username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="input-base"
              autoComplete="username"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 7, fontSize: "0.83rem", fontWeight: 500, color: "var(--text-secondary)" }}>Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input-base"
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 7, fontSize: "0.83rem", fontWeight: 500, color: "var(--text-secondary)" }}>Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="input-base"
              autoComplete="new-password"
            />
            {form.password && (
              <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center" }}>
                {[1,2,3,4].map((i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: i <= strength ? strengthColors[strength] : "var(--border)",
                    transition: "var(--transition)",
                  }} />
                ))}
                <span style={{ fontSize: "0.72rem", color: strengthColors[strength] || "var(--text-muted)", marginLeft: 8, whiteSpace: "nowrap" }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 7, fontSize: "0.83rem", fontWeight: 500, color: "var(--text-secondary)" }}>Confirm Password</label>
            <input
              id="reg-confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              className="input-base"
              style={{
                borderColor: form.confirm && form.confirm !== form.password ? "var(--danger)" : undefined,
              }}
              autoComplete="new-password"
            />
          </div>

          <button
            id="reg-submit-btn"
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
                Creating account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "var(--accent-violet-light)", fontWeight: 600, textDecoration: "none" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
