# @skilltree/ui

Shared component library for SkillTree applications.

## Getting Started

```bash
cd packages/ui
pnpm build
```

## Responsibilities

- Provides reusable React components (buttons, inputs, modals, etc.).
- Enforces the design system defined in @skilltree/theme.
- Exposes components with stable APIs for contractors and internal apps.

## Usage

```
import { Button } from "@skilltree/ui";

export function MyForm() {
  return <Button variant="primary">Submit</Button>;
}
```

## Notes

- All components should follow accessibility best practices (ARIA, keyboard nav).
- Keep package dependencies minimal; prefer consuming helpers from @skilltree/utils if possible.
