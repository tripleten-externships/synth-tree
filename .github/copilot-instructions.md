## Synth Tree — Copilot / AI Agent Instructions

This file gives concise, actionable guidance for AI coding agents to be immediately productive in this monorepo.

- Monorepo overview: pnpm workspaces (see `pnpm-workspace.yaml`). Top-level apps live under `apps/*` and shared code under `packages/*`.
- Key apps: `apps/admin-dashboard` (Vite + React + Firebase), `apps/api` (Node/Express + Apollo Server + Pothos + Prisma), and `apps/infra` (AWS CDK). Shared packages: `packages/ui`, `packages/theme`, `packages/config`, `packages/api-types`.

Essential working commands

- Install deps (root): `pnpm install` (root package.json defines `packageManager: pnpm@10.x`).
- Start everything (root `dev`): `pnpm dev` — this runs `docker compose up -d` then launches `admin-dashboard` and `api` dev servers in parallel.
- Start a single app: `pnpm --filter ./apps/admin-dashboard dev` or `pnpm --filter ./apps/api dev`.
- Database: `pnpm db:start` / `pnpm db:stop` at repo root (runs `docker-compose`). Prisma commands are in `apps/api` (migrate, generate, studio).
- Build all: `pnpm -r build` (invokes package-level build scripts).

Project-specific patterns and integration points (examples)

- GraphQL & types: The API uses Pothos (code-first) and Prisma. The GraphQL builder lives in `apps/api/src/graphql` (see `builder.ts` and `schema.ts`). Run `pnpm codegen` from `apps/api` to emit types into `packages/api-types`.
- Prisma: schema at `apps/api/prisma/schema.prisma`. Use `pnpm prisma migrate dev` and `pnpm prisma generate` inside `apps/api`.
- Frontend: `apps/admin-dashboard` uses Vite + Tailwind + `@skilltree/*` packages. Env vars are in `apps/admin-dashboard/.env` (VITE*FIREBASE*\*, VITE_API_URL).
- Component library & docs: `packages/ui` contains Storybook. Start it with `pnpm --filter ./packages/ui storybook`.
- Firebase: Frontend and backend expect Firebase credentials; the backend reads service account vars (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`) from `apps/api/.env`.

Conventions & naming

- Packages use the `@skilltree/*` scope. When editing cross-package exports, update types in `packages/api-types` by running the API codegen.
- Branch/commit naming: repository README documents branch prefixes (feature/bugfix/hotfix/docs) — follow those.
- CI/Deploy: workflows live under `.github/workflows`. CI uses smart path-detection to run only affected checks (see `.github/workflows/README.md`).

Quick pointers for common tasks

- Add a DB migration: edit `apps/api/prisma/schema.prisma` → `cd apps/api` → `pnpm prisma migrate dev --name desc` → `pnpm prisma generate` → `pnpm codegen`.
- Regenerate GraphQL types after schema or resolver changes: `cd apps/api && pnpm codegen`.
- Local dev that requires DB: run `pnpm db:start` (root) before `pnpm dev`.
- When changing infra/CDK under `apps/infra`, run `npx cdk diff` and follow `.github/workflows/README.md` for deploy steps.

Files to consult when making changes

- `package.json` (root) — workspace scripts (`dev`, `db:start`, `build`).
- `pnpm-workspace.yaml` — which packages/apps are in the workspace.
- `apps/api/package.json` — API scripts (dev, build, codegen, emit:schema). See `scripts/emit-schema.ts`.
- `apps/admin-dashboard/package.json` — frontend scripts (dev, build, lint).
- `packages/ui` & `packages/theme` — design tokens and components (Storybook lives in `packages/ui`).
- `.github/workflows/README.md` — CI mapping and secrets required for deployments.

What NOT to assume

- Do not assume any global `npm` scripts beyond what the root `package.json` provides — prefer `pnpm` and the `--filter` pattern for workspace commands.
- Do not hardcode secrets or private env values; CI and repo README reference required GitHub secrets and local `.env` examples.

If you make changes

- Run local lint/build for the affected package(s). Example: edit `apps/admin-dashboard` → `pnpm --filter ./apps/admin-dashboard build`.
- If you change GraphQL schema or Prisma models, run generate/codegen steps and adjust `packages/api-types` as needed.

Notes for reviewer: no existing `.github/copilot-instructions.md` or AGENT.md was found; this file was created to centralize the minimal, actionable guidance AI agents need to operate here. Ask for additions or specific workflows to prioritize (e.g., release, staging tests, or local debugging tips).

---

Please review and tell me if you want more examples (sample PR, sample migration, or a short troubleshooting checklist).
