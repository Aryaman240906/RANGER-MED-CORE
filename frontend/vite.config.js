import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite must know how to handle React + JSX
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // auto opens browser
  },
});
