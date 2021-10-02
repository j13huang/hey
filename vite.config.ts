import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = 3001;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "ui",
  clearScreen: false,
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: `${__dirname}/dist`,
    emptyOutDir: true,
  },
});
