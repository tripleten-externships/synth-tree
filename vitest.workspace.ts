import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./apps/admin-dashboard/vitest.config.ts",
    test: {
      name: "admin-dashboard",
      root: "./apps/admin-dashboard",
    },
  },
  {
    extends: "./apps/admin-dashboard/vitest.integration.config.ts",
    test: {
      name: "admin-dashboard:integration",
      root: "./apps/admin-dashboard",
    },
  },
  {
    extends: "./apps/client-frontend/vitest.config.ts",
    test: {
      name: "client-frontend",
      root: "./apps/client-frontend",
    },
  },
  {
    extends: "./apps/client-frontend/vitest.integration.config.ts",
    test: {
      name: "client-frontend:integration",
      root: "./apps/client-frontend",
    },
  },
  {
    extends: "./apps/api/vitest.config.ts",
    test: {
      name: "api",
      root: "./apps/api",
    },
  },
  {
    extends: "./apps/api/vitest.integration.config.ts",
    test: {
      name: "api:integration",
      root: "./apps/api",
    },
  },
  {
    extends: "./packages/ui/vitest.config.ts",
    test: {
      name: "ui",
      root: "./packages/ui",
    },
  },
  {
    extends: "./packages/ui/vitest.integration.config.ts",
    test: {
      name: "ui:integration",
      root: "./packages/ui",
    },
  },
]);
