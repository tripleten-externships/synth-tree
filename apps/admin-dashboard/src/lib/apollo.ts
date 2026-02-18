import { ApolloClient, HttpLink,InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { auth } from "./firebase";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

const authLink = new SetContextLink(async (prevContext: Record<string, unknown>) => {
  let token: string | undefined;
  
  try {
    token = await auth.currentUser?.getIdToken();
  } catch (error) {
    console.error("Failed to get Firebase auth token:", error);
    // Continue without token - API will handle unauthorized requests
  }

  return {
    headers: {
      ...(prevContext.headers as Record<string, string>),
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

