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
> The Firebase API key is required to mint a real Firebase ID token, which is the token the Apollo Server context authentication middleware verifies.

> ❗ **If you skip this step:**
>
> - The CLI script cannot exchange the custom token for an ID token
> - Authentication will always fail in Apollo Sandbox
> - You will see "Token verification failed" in your backend logs
>   👉 **Do this first before running any dev authentication commands.**

---

During development, our API Server enforces real Firebase authentication through its middleware. Since our dev environment does not automatically create users or tokens, requests issued to our API will fail unless valid Firebase ID token is provided in the headers.

This guide explains:

- Why the middleware requires an authenticated user
- How to create a Firebase + Prisma user locally
- How to generate a valid ID token with a CLI script
- Where generated files live (and why they are gitignored)

## 🚧 Why Apollo Server Requires an Auth Token

Our auth middleware validates every request:

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
- `--password` → Optional password for the user

### Examples

#### Basic usage without password

```bash
pnpm create:dev-admin -- --email dev@example.com --name "Dev Admin"
```

#### With a custom password

```bash
pnpm create:dev-admin -- --email dev@example.com --name "Dev Admin" --password "SecurePassword123"
```

#### With role and password

```bash
pnpm create:dev-admin -- --email user@example.com --name "Test User" --role USER --password "TestPass456"
```

### Password Behavior

- **For new users**: If `--password` is provided, the Firebase user will be created with that password
- **For existing users**: If `--password` is provided, the existing user's password will be updated to the new value
- **When omitted**: The script works as before—Firebase will create users without passwords (they can later sign in via email link or other providers)

### What the script does:

- **Ensures a Firebase Auth user exists**
  - Fetches by email
  - Creates it if not found
  - Sets or updates password if `--password` is provided
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

## 🧩 Summary

- API Server requires a valid Firebase ID token for all authenticated operations
- The dev script creates a real Firebase user + Prisma record
- It also generates a real ID token identical to what the frontend would supply
- The token is stored in a `.gitignored` location
- Paste that token into postman as a Bearer header to authenticate
