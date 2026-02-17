import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmbedInput } from "../../admin-dashboard/src/components/EmbedInput";
import App from "./app";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
