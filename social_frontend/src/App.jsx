import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRouts";
import { Toaster } from "react-hot-toast";
import ImageLightbox from "./components/common/ImageLightbox";

function App() {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const handler = (e) => setLightbox(e.detail);
    window.addEventListener("pulse-lightbox", handler);
    return () => window.removeEventListener("pulse-lightbox", handler);
  }, []);

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-lg)",
          },
          success: {
            iconTheme: { primary: "var(--accent-cyan)", secondary: "var(--bg-card)" },
          },
          error: {
            iconTheme: { primary: "var(--danger)", secondary: "var(--bg-card)" },
          },
        }}
      />
      <ImageLightbox
        src={lightbox?.src}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
      <AppRoutes />
    </>
  );
}

export default App;
