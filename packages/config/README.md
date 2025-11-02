# @skilltree/config

Configuration utilities and constants for SkillTree applications.

## Getting Started

```bash
cd packages/config
pnpm build
```

## Responsibilities

- Provides runtime configuration (API endpoints, feature flags, environment variables).
- Centralizes constants used across apps and packages.
- Exposes helpers for reading configuration safely.

## Usage

```
import { getApiBaseUrl } from "@skilltree/config";

fetch(`${getApiBaseUrl()}/users`);
```

## Notes

- Sensitive values (API keys, secrets) should not be hardcoded.
- Prefer environment variables and .env files for local dev.
- Keep this package free of UI or business logic.
