# Local authentication setup

This guide covers everything you need to do auth locally as a Synth Tree contributor.

## TL;DR

```bash
# 1. Drop the local-project service-account JSON into:
apps/api/scripts/credentials/firebase-local-service-account.json

# 2. Configure your .env files (see "Environment setup" below).

# 3. Bring up the database and seed two test users:
pnpm db:start
pnpm prisma:migrate:dev
pnpm db:seed:local-users

# 4. Run everything:
pnpm dev

# Log into the admin app at http://localhost:5173 with:
#   admin@local.dev / Local123!
```

## The three Firebase projects

| Project   | Who manages it             | When to interact with it                                                                             |
| --------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| **prod**  | deployment automation only | never directly — only through deploys                                                                |
| **dev**   | the project lead           | only via the deployed dev environment, with the shared test credentials from the team knowledge base |
| **local** | every student              | this is what your laptop hits during `pnpm dev`. Create users here freely.                           |

**As a student, you only ever interact with the _local_ Firebase project.**

The local project's service-account JSON, web config values, and the standard test-user passwords all live in the team knowledge base. Grab them from there — they're not in this repo (and shouldn't be).

## Environment setup

### One-time: drop in the service-account JSON

Download the local Firebase project's service-account JSON from the team knowledge base. Save it as:

```
apps/api/scripts/credentials/firebase-local-service-account.json
```

The `scripts/credentials/` folder is gitignored — the JSON will never be committed.

### `apps/api/.env`

Copy the template and fill in the values from the team knowledge base:

```bash
cp apps/api/.env.example apps/api/.env
```

Required:

```
FIREBASE_SERVICE_ACCOUNT_PATH=./scripts/credentials/firebase-local-service-account.json
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/synthtree?schema=public
```

Optional but recommended:

```
FIREBASE_API_KEY=<from local Firebase web app config>
```

`FIREBASE_API_KEY` is the public Web API key — the same value the frontends use as `VITE_FIREBASE_API_KEY`. The API server uses it to mint real Firebase ID tokens via the custom-token → ID-token exchange.

You can skip it. Without it, `createLocalUser.ts` and `db:seed:local-users` will still create the Firebase Auth user and the Postgres mirror, and you can log in via the frontend UI normally. You only need the key if you want to hit the GraphQL API headlessly (Apollo Sandbox, curl, etc.) using a saved Bearer token.

To find the value: Firebase Console → Project Settings → General → Your apps → Web app → Config → `apiKey`.

### `apps/admin-dashboard/.env` and `apps/client-frontend/.env`

```bash
cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env
cp apps/client-frontend/.env.example apps/client-frontend/.env
```

Fill in the `VITE_FIREBASE_*` values from the **local** project's web app config in the Firebase Console (or the team knowledge base):

```
Firebase Console → Project Settings → General → Your apps → Web app → Config
```

The default `VITE_USE_FIREBASE_EMULATOR=false` is correct for normal local dev — it makes both frontends talk to the real local Firebase project. Multiple students all hitting the same local project is fine; it's how everyone shares the user pool. Only flip to `true` if you specifically want a fully-offline workflow with the Firebase Auth emulator.

## Creating test accounts

The repo ships two helpers, both backed by the same `createLocalUser` function.

### Bulk seed (recommended for first run)

```bash
pnpm db:seed:local-users
```

Creates the standard pair of test accounts:

| Email               | Role  | Password    |
| ------------------- | ----- | ----------- |
| `admin@local.dev`   | ADMIN | `Local123!` |
| `learner@local.dev` | USER  | `Local123!` |

Idempotent — re-running just upserts and refreshes their tokens.

### One-off (when you want a custom persona)

```bash
# Make a user account
pnpm create:user --email alice@example.com --name "Alice" --password Local123!

# Make an admin account
pnpm create:user --email alice-admin@example.com --name "Alice (admin)" --role admin --password Local123!
```

`--role` defaults to `user`. Pass `--role admin` for admins.

The CLI:

1. Refuses to run with `NODE_ENV=production`.
2. Prints the active Firebase project ID and pauses 3 seconds so you can Ctrl+C if it's pointing somewhere unexpected.
3. Creates (or updates) the Firebase Auth user.
4. Upserts a matching row in the local Postgres `User` table.
5. Mints a real Firebase ID token via the standard custom-token → ID-token exchange (same flow the frontend uses internally).
6. Writes the credentials to `apps/api/scripts/credentials/<email>.credentials.json`.

The credentials file looks like:

```json
{
  "email": "alice@example.com",
  "uid": "abc123…",
  "role": "USER",
  "password": "Local123!",
  "idToken": "eyJhbGciOiJSUzI1NiIs…",
  "refreshToken": "AEu4IL2…",
  "createdAt": "2026-05-10T18:30:00.000Z"
}
```

Use the `idToken` as a `Bearer <token>` header in Apollo Sandbox or curl to make authenticated GraphQL requests.

## Refreshing an expired token

Firebase ID tokens expire after one hour. If you want to keep using the same `idToken` for Apollo Sandbox without re-running the create command:

```bash
pnpm refresh:token alice@example.com
```

Updates `<email>.credentials.json` in place with a fresh `idToken` and `refreshToken`.

## Logging into the apps via the UI

Both frontends use the standard Firebase email/password login. After running `pnpm db:seed:local-users`, just open <http://localhost:5173> (admin) or <http://localhost:5174> (client) and sign in as:

```
admin@local.dev / Local123!
learner@local.dev / Local123!
```

## Troubleshooting

**"Firebase admin is not initialized" in API logs.**
Check `FIREBASE_SERVICE_ACCOUNT_PATH` points at a real file. Run `cat $(cat apps/api/.env | grep SERVICE_ACCOUNT | cut -d= -f2)` to verify.

**"Token verification failed" in API logs but you do have a token.**
The token was likely minted against a different Firebase project than the one the API server is configured for. Make sure `FIREBASE_SERVICE_ACCOUNT_PATH` and your frontend `VITE_FIREBASE_PROJECT_ID` are pointing at the same project.

**ID token expired (after an hour).**
Run `pnpm refresh:token <email>`.

**Want to start over with a clean user list.**
Delete the users in the Firebase Console → Authentication tab (or via `firebase auth:export` / `auth:import`), then `pnpm prisma:reset` to clear the Postgres mirror, then re-seed.

## Where credentials live

| Path                                                               | What's in it                                                 | Tracked?      |
| ------------------------------------------------------------------ | ------------------------------------------------------------ | ------------- |
| `apps/api/scripts/credentials/firebase-local-service-account.json` | Service-account JSON for the local Firebase project          | ❌ gitignored |
| `apps/api/scripts/credentials/<email>.credentials.json`            | Per-user uid + idToken + refreshToken from `createLocalUser` | ❌ gitignored |
| `apps/api/.env`                                                    | Local API env vars                                           | ❌ gitignored |
| `apps/admin-dashboard/.env`, `apps/client-frontend/.env`           | Local frontend env vars                                      | ❌ gitignored |
| `apps/api/.env.example` and the two frontend `.env.example` files  | Templates with placeholders                                  | ✅ tracked    |

If a credential ever lands in a tracked file, treat it as compromised — rotate the key and force-push history if needed.
