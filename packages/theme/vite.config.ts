import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ["src/**/*"],
      exclude: ["**/*.test.*", "**/*.spec.*"],
    }),
    // Custom plugin to copy CSS files
    {
      name: "copy-css-files",
      writeBundle() {
        // Ensure the styles directory exists in dist
        mkdirSync(resolve(__dirname, "dist/styles"), { recursive: true });

        // Copy the globals.css file
        copyFileSync(
          resolve(__dirname, "src/styles/globals.css"),
          resolve(__dirname, "dist/styles/globals.css")
        );
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "tailwind/index": resolve(__dirname, "src/tailwind/index.ts"),
      },
      name: "SkillTreeTheme",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
