# @synth-tree/theme

Theme tokens and design primitives for Synth Tree applications.

## Getting Started

```bash
cd packages/theme
pnpm build
```

## Responsibilities

- Provides design tokens (colors, spacing, typography, breakpoints).
- Ensures consistent look-and-feel across apps and contractor-delivered packages.
- Exports theme objects/hooks compatible with @synth-tree/ui.

## Usage

```
import { useTheme } from "@synth-tree/theme";

function Example() {
  const theme = useTheme();
  return <div style={{ color: theme.colors.primary }}>Hello</div>;
}
```

## Notes

- Update theme tokens only through design review.
- Version carefully; theme changes can cascade across all apps.
