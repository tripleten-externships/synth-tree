import "@skilltree/theme/styles/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@skilltree/theme";

import App from "./App.tsx";

createRoot(document.getElementById("root") as Element).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
