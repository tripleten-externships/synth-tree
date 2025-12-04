import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: async (config) => {
    // Ensure CSS is processed correctly
    if (config.css) {
      config.css.postcss = {
        plugins: [require("tailwindcss"), require("autoprefixer")],
      };
    }

    // Configure Vite to handle packages with "use client" directives
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
    ];

    config.ssr = config.ssr || {};
    config.ssr.noExternal = [
      ...(config.ssr.noExternal || []),
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
    ];

    // Add alias resolution for @/* paths and workspace packages
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "../src"),
      // Removed @skilltree/theme alias to allow proper package resolution
    };

    return config;
  },
};

export default config;
