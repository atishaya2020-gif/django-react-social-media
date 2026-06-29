import React from "react";

const variants = {
  primary: {
    background: "var(--accent-gradient)",
    color: "var(--text-primary)",
    border: "none",
    boxShadow: "0 4px 16px rgba(124, 58, 237, 0.35)",
  },
  ghost: {
    background: "var(--bg-glass)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    boxShadow: "none",
  },
  outline: {
    background: "transparent",
    color: "var(--accent-violet-light)",
    border: "1px solid var(--accent-violet)",
    boxShadow: "none",
  },
  danger: {
    background: "var(--danger-dim)",
    color: "var(--danger)",
    border: "1px solid rgba(239,68,68,0.3)",
    boxShadow: "none",
  },
  cyan: {
    background: "var(--accent-cyan-dim)",
    color: "var(--accent-cyan)",
    border: "1px solid rgba(6,182,212,0.3)",
    boxShadow: "none",
  },
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  fullWidth = false,
  icon = null,
  type = "button",
  style: extraStyle = {},
  ...rest
}) => {
  const sizing = {
    sm: { padding: "6px 14px", fontSize: "0.8rem", borderRadius: "var(--radius-sm)" },
    md: { padding: "10px 22px", fontSize: "0.9rem", borderRadius: "var(--radius-md)" },
    lg: { padding: "14px 32px", fontSize: "1rem", borderRadius: "var(--radius-md)" },
  };

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 600,
    fontFamily: "var(--font)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "var(--transition)",
    width: fullWidth ? "100%" : "auto",
    whiteSpace: "nowrap",
    ...variants[variant],
    ...sizing[size],
    ...extraStyle,
  };

  const hoverStyle = {
    filter: disabled ? "none" : "brightness(1.1)",
    transform: disabled ? "none" : "translateY(-1px)",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
        e.currentTarget.style.transform = "none";
      }}
      {...rest}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
