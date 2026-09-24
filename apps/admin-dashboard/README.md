# AdminDashboard App

This is the host application that composes all features and shared libraries.

**Deployed at** `admin.dev.synth-tree.com` (dev) and `admin.synth-tree.com` (prod)
— its own subdomain, separate from the learner client app, deployed by
[`deploy-admin.yml`](../../.github/workflows/deploy-admin.yml). Locally it runs at
<http://localhost:5173>.

## Getting Started

```bash
pnpm install
pnpm dev --filter ./apps/admin-dashboard
```

## Responsibilities

- Provides top-level routing, layout, and navigation.
- Composes internal packages (@synth-tree/ui, @synth-tree/theme, @synth-tree/config).
- Integrates contractor-delivered packages.

## Tech Stack

- React
- Vite
- TypeScript
- pnpm workspaces

## Notes

- Avoid placing shared logic here; put it into packages so other apps can reuse it.
- Keep this app thin: orchestration and composition only.
