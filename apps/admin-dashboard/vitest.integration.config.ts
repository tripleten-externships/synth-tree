import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.integration.{test,spec}.{ts,tsx}"],
  },
});
