import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  emoji,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
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
      gap: 8,
    }}
  >
    <div
      style={{
        background: "var(--accent-gradient-soft)",
        padding: 20,
        borderRadius: "50%",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Icon ? (
        <Icon size={48} color="var(--accent-violet-light)" strokeWidth={1.5} />
      ) : (
        <span style={{ fontSize: "2.5rem" }}>{emoji || "✦"}</span>
      )}
    </div>
    <h3 style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 700 }}>
      {title}
    </h3>
    {description && (
      <p style={{ maxWidth: 360, lineHeight: 1.6, fontSize: "0.95rem" }}>{description}</p>
    )}
    {action}
  </motion.div>
);

export default EmptyState;
