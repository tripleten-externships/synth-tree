import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

// graphql API url - single src of truth
const apiUrl = import.meta.env.VITE_API_URL;

// Fail if env variable is missing instead of sending req to an undefined url
if (!apiUrl) {
    throw new Error("You must set VITE_API_URL");
};


// base HTTP link used for all graphql req
const httpLink = new HttpLink({ uri: apiUrl });

// optional auth link 
const authLink = new SetContextLink(async (prevContext) => {
    try {
        // lazy import so firebase is optional
        const { getAuth } = await import("firebase/auth")

        const auth = getAuth();
        const user = auth.currentUser;

        // no logged in user - proceed w/o auth header
        if (!user) {
            return prevContext;
        }

        const token = await user.getIdToken();

        return {
            ...prevContext,
            headers: {
                ...(prevContext.headers ?? {}), 
                // attach auth header only when a token exists
                ...(token ? { authorization: `Bearer ${token}`} : {}),
            },
        };
    } catch {
        // firebase not intialized/unavaible - skip auth and return context
        return prevContext;
    }
});

// apollo client instance used by student-facing frontend
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

