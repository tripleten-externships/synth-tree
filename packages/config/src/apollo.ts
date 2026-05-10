import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import type { Auth } from "firebase/auth";

import { getApiUrl } from "./api";

interface CreateApolloClientOptions {
  /** Firebase Auth instance used to attach a Bearer token to every request. */
  auth?: Auth;
  /** Override the API URL (defaults to `getApiUrl()`). */
  uri?: string;
}

/**
 * Creates an Apollo Client wired to the Synth Tree GraphQL API. If a Firebase
 * Auth instance is provided, every request gets a `Bearer <idToken>` header.
 * Unauthenticated callers get the request without an `authorization` header,
 * which is the right behavior for public queries.
 */
export function createApolloClient(
  options: CreateApolloClientOptions = {},
): ApolloClient {
  const httpLink = new HttpLink({ uri: options.uri ?? getApiUrl() });

  const authLink = new SetContextLink(async (prevContext) => {
    if (!options.auth) return prevContext;

    let token: string | undefined;
    try {
      token = await options.auth.currentUser?.getIdToken();
    } catch {
      // Network or refresh failure — fall through and send request anonymously.
    }

    return {
      ...prevContext,
      headers: {
        ...((prevContext.headers as Record<string, string> | undefined) ?? {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
