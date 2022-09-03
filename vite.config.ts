import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import relay from "vite-plugin-relay";

const PORT = 3001;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), relay],
  root: "ui",
  clearScreen: false,
  server: {
    proxy: {
      "/graphql": {
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
