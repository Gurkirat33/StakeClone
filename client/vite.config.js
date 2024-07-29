import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  server: {
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://localhost:8000",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
  },
  plugins: [react()],
}));
