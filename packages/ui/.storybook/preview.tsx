import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "@skilltree/theme";
import "@skilltree/theme/styles/globals.css";

const ColorModeLoader = ({ colorMode }) => {
  const { setColorMode } = useTheme();
  useEffect(() => {
    console.log("Setting color mode to:", colorMode);
    setColorMode(colorMode);
  }, [colorMode]);
  return null;
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <ColorModeLoader colorMode={context.globals.theme} />
          <Story {...context} />
        </div>
      </ThemeProvider>
    ),
  ],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
