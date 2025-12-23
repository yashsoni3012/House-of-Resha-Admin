import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // ✅ Proxy works ONLY in development
  server: mode === "development" ? {
    proxy: {
      "/api": {
        target: "https://api.houseofresha.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  } : undefined,
}));
