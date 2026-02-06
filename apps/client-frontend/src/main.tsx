import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Temporarily disabled Apollo Client due to Vite import issue
// import { ApolloProvider } from "@apollo/client";
// import { apolloClient } from "./lib/apolloClient";
import App from "./app";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
