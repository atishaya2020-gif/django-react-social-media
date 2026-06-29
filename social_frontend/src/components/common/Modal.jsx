import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "480px" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
        animation: "fadeIn 0.2s ease forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          boxShadow: "var(--shadow-glow-violet), var(--shadow-lg)",
        }}
      >
        {/* Header */}
        {title && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
          }}>
            <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: "var(--bg-glass)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--danger-dim)";
                e.currentTarget.style.color = "var(--danger)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-glass)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ✕
            </button>
          </div>
        )}
        {/* Body */}
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
