import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider } from "@synth-tree/theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import { apolloClient } from "./lib/apollo";
import "@synth-tree/theme/styles/globals.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
