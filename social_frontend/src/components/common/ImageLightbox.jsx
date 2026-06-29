import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const ImageLightbox = ({ src, alt, onClose }) => (
  <AnimatePresence>
    {src && (
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          aria-label="Close preview"
        >
          <X size={22} />
        </motion.button>
        <motion.img
          src={src}
          alt={alt || "Preview"}
          className="lightbox-image"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export const ImagePreviewTrigger = ({ src, alt, children, className = "" }) => {
  if (!src) return children;

  return (
    <div
      className={`image-preview-trigger ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("pulse-lightbox", { detail: { src, alt } }));
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("pulse-lightbox", { detail: { src, alt } }));
        }
      }}
    >
      {children}
      <span className="image-preview-badge">
        <ZoomIn size={16} />
      </span>
    </div>
  );
};

export default ImageLightbox;
