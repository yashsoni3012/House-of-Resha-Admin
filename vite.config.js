import { defineConfig } from "vite"; // ✅ IMPORT THIS
import react from "@vitejs/plugin-react"; // if you use React

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "https://api.houseofresha.com": {
        target: "https://api.houseofresha.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

    },
  },
});
