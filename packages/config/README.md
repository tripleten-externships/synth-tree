# @synth-tree/config

Shared runtime configuration helpers used by the Synth Tree frontends.

This package exists so the admin-dashboard and client-frontend don't each
re-implement Firebase initialization, the Apollo client, or env-var reading
slightly differently.

## Exports

```ts
import {
  getApiUrl,
  getFirebaseConfig,
  initFirebaseAuth,
  createApolloClient,
} from "@synth-tree/config";

// Or import from a subpath if you only need one piece:
import { initFirebaseAuth } from "@synth-tree/config/firebase";
import { createApolloClient } from "@synth-tree/config/apollo";
```

### `getApiUrl(): string`

Reads `VITE_API_URL`. Throws if it isn't set.

### `getFirebaseConfig(): FirebaseOptions`

Reads `VITE_FIREBASE_*` env vars and returns a Firebase config object.
Throws if any required field is missing.

### `initFirebaseAuth(): { app, auth }`

Initializes Firebase (or returns the existing app, HMR-safe) and returns
the `Auth` instance. Connects to the Firebase Auth emulator in dev unless
`VITE_USE_FIREBASE_EMULATOR=false`.

### `createApolloClient({ auth?, uri? }): ApolloClient`

Creates an Apollo Client wired to the GraphQL API. If a Firebase `Auth`
instance is provided, every request gets a `Bearer <idToken>` header.

## Required env vars (consumer apps)

Both frontends should set the following in their `.env`:

```
VITE_API_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

See each app's `.env.example` for templates.

## Notes

- Source-only package (no build step). Vite handles TypeScript directly via
  the workspace symlink.
- Sensitive values must come from environment variables — nothing is hardcoded
  in this package.
