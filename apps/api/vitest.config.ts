import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/*.integration.{test,spec}.{ts,tsx}", "**/node_modules/**"],
  },
});
