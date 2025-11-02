import { createTailwindConfig } from "@skilltree/theme/tailwind";

/** @type {import('tailwindcss').Config} */
export default createTailwindConfig({
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./stories/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Additional UI-specific customizations can go here
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
});
