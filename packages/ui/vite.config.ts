import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import type { Plugin } from "vite";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      exclude: ["**/*.stories.*", "**/*.test.*"],
    }) as Plugin,
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SkillTreeUI",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@skilltree/theme",
        "@radix-ui/react-slot",
        "@radix-ui/react-dialog",
        "@radix-ui/react-label",
        "@radix-ui/react-separator",
        "class-variance-authority",
        "react-hook-form",
        "@hookform/resolvers",
        "zod",
        "lucide-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@skilltree/theme": "SkillTreeTheme",
        },
      },
    },
  },
});
