import "@skilltree/theme/styles/globals.css";

import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider } from "@skilltree/theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { apolloClient } from "./lib/apollo";


createRoot(document.getElementById("root") as Element).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>
);
