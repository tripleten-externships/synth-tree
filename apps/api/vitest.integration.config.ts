import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.integration.{test,spec}.{ts,tsx}"],
  },
});
