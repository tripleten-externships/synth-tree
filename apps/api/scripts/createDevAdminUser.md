# 🔐 Development Authentication Guide

## ⚠️ ATTENTION REQUIRED — BEFORE RUNNING THE SCRIPT

You must copy your Firebase API key from the Admin Dashboard app into the API service environment.

**Step 1 — Open:**

```
apps/admin-dashboard/.env
```

Find this value:

```
VITE_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxxx
```

**Step 2 — Open:**

```
apps/api/.env
```

Add the key there, but rename it to:

```
FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxxx
```

> 🔥 **This is mandatory.**

The Firebase API key is required to mint a real Firebase ID token, which is the token the Apollo Server context authentication middleware verifies.

> ❗ **If you skip this step:**
>
> - The CLI script cannot exchange the custom token for an ID token
> - Authentication will always fail in Apollo Sandbox
> - You will see "Token verification failed" in your backend logs

> 👉 **Do this first before running any dev authentication commands.**

---

During development, our Apollo Server enforces real Firebase authentication through its context middleware. Since our dev environment does not automatically create users or tokens, requests issued from Apollo Sandbox will fail unless a valid Firebase ID token is provided in the headers.

This guide explains:

- Why the context middleware requires an authenticated user
- How to create a Firebase + Prisma user locally
- How to generate a valid ID token with a CLI script
- How to attach that token to Apollo Sandbox
- Where generated files live (and why they are gitignored)

## 🚧 Why Apollo Server Requires an Auth Token

Our GraphQL context middleware validates every request:

- It checks for an `authorization: Bearer <idToken>` header
- It verifies the token using Firebase Admin
- It looks up a matching Prisma User by Firebase UID

If either:

- no token is provided, or
- no corresponding user exists in Prisma

…the request fails with an authentication error.

This is the correct behavior, but it makes development difficult without a real token + user.

## 🎭 Mocking the Real Firebase Authentication Flow in Development

Instead of disabling authentication or bypassing the middleware, we simulate the actual production flow by:

1. Creating a Firebase Auth user
2. Creating the matching Prisma user
3. Generating a real, verifiable Firebase ID token

To automate this, we use the script:

```
scripts/createDevAdminUser.ts
```

This script performs the full flow the frontend would normally trigger using the Firebase client SDK — but headlessly, via the Firebase Admin SDK and the Identity Toolkit REST API.

## 🧰 Using the CLI Script

You must pass at least:

- `--email` → User email
- `--name` → Display name
- `--role` → Optional (defaults to ADMIN)

### Example

```bash
pnpm create:dev-admin -- --email dev@example.com --name "Dev Admin"
```

### What the script does:

- **Ensures a Firebase Auth user exists**
  - Fetches by email
  - Creates it if not found
- **Upserts the Prisma user**
  - Uses the Firebase UID as the Prisma id so both stay in sync.
- **Generates a Firebase custom token**
- **Exchanges it for a real ID token**
  - This uses the same process the frontend SDK uses under the hood.
- **Saves a credential file to:**
  ```
  scripts/credentials/<email>.credentials.json
  ```

This file includes:

```json
{
  "email": "dev@example.com",
  "uid": "FirebaseUID",
  "role": "ADMIN",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ikp...etc",
  "refreshToken": "AEu4IL2....",
  "createdAt": "2025-12-01T19:23:11.602Z"
}
```

## 🙈 Gitignore Behavior

The directory:

```
scripts/credentials/
```

is fully `.gitignored`, including:

- The folder
- Any `*.credentials.json` files

This ensures no tokens or local identity files are ever committed.

## 🚀 Using the ID Token in Apollo Sandbox

Once the script finishes, open the generated JSON file and copy the value of `idToken`.

Then in Apollo Sandbox:

1. Open the Headers tab on individual requests OR go the connection settings and add the token to the Authorization header. Pictures will be sent.
2. Add:
   ```json
   {
     "authorization": "Bearer <paste_idToken_here>"
   }
   ```
3. Save or persist the headers (optional)
4. Run queries normally — the context middleware will now authenticate you successfully

This is identical to how a real frontend client sends ID tokens in production.

## 📸 Screenshots & Usage Examples

Screenshots showing:

- Where to find the generated credentials file
- Where to paste the token into Apollo Sandbox headers
- Example of a successful authenticated GraphQL call

…are being sent separately in the Hub chat and attached to the pull request.

## 🧩 Summary

- Apollo Server requires a valid Firebase ID token for all authenticated operations
- The dev script creates a real Firebase user + Prisma record
- It also generates a real ID token identical to what the frontend would supply
- The token is stored in a `.gitignored` location
- Paste that token into Apollo Sandbox as a Bearer header to authenticate

This keeps development aligned with real authentication behavior while avoiding unsafe shortcuts or disabling auth logic.
