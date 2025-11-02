# AdminDashboard App

This is the host application that composes all features and shared libraries.

## Getting Started

```bash
pnpm install
pnpm dev --filter ./apps/admin-dashboard
```

## Responsibilities

- Provides top-level routing, layout, and navigation.
- Composes internal packages (@skilltree/ui, @skilltree/theme, @skilltree/config).
- Integrates contractor-delivered packages.

## Tech Stack

- React
- Vite
- TypeScript
- pnpm workspaces

## Notes

- Avoid placing shared logic here; put it into packages so other apps can reuse it.
- Keep this app thin: orchestration and composition only.
