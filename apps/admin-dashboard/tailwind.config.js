/** @type {import('tailwindcss').Config} */
import { createTailwindConfig } from "@skilltree/theme/tailwind";

export default createTailwindConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    // Include UI package components
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
});
