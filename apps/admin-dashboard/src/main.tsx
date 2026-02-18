import "@skilltree/theme/styles/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@skilltree/theme";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/apollo";

import App from "./App.tsx";

createRoot(document.getElementById("root") as Element).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
