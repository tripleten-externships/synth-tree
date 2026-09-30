/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
  },
  test: {
    globals: true,
    environment: "node",
  },
});
