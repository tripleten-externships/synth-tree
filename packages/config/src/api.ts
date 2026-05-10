/**
 * Returns the GraphQL API URL from `VITE_API_URL`.
 * Throws if the variable is missing — fail fast rather than send requests
 * to `undefined`.
 */
export function getApiUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error(
      "VITE_API_URL is not set. Copy .env.example to .env and set it (typically http://localhost:4000/graphql for local dev).",
    );
  }
  return url;
}
