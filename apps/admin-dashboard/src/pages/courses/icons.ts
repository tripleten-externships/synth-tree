// Lucide-style line icons as inline SVG markup, keyed by name.
// The <svg> uses stroke="currentColor" so the hex glyph color drives it.
// Add your own here, or swap this map for the `lucide-react` package.

export const ICONS: Record<string, string> = {
  flask:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M6.4 16h11.2"/></svg>',
  atom:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2-2 0-7.4-4.5-11.9-4.5-4.5-9.9-6.5-11.9-4.5-2 2 0 7.4 4.5 11.9 4.5 4.5 9.9 6.5 11.9 4.5"/><path d="M15.7 15.7c4.5-4.5 6.5-9.9 4.5-11.9-2-2-7.4 0-11.9 4.5C3.8 12.8 1.7 18.2 3.8 20.2c2 2 7.4 0 11.9-4.5"/></svg>',
  fork:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><path d="M12 12v4"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',
  beaker:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14"/><path d="M6 3v8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V3"/><path d="M6 14h12"/></svg>',
  wave:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5 0 2.5-5 5-5s2.5 5 5 5 2.5-5 5-5 2.5 5 5 5"/></svg>',
  cubes:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 6v8l8 4 8-4V6Z"/><path d="m4 6 8 4 8-4"/><path d="M12 10v8"/></svg>',
  orbit:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(45 12 12)"/></svg>',
  ruler:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21 3-9 9-9 9-2-2 18-18 2 2Z"/><path d="m7 11 2 2"/><path d="m10 8 2 2"/><path d="m13 5 2 2"/></svg>',
  trophy:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 0 12 0V3H6Z"/><path d="M6 5H3v2a3 3 0 0 0 3 3"/><path d="M18 5h3v2a3 3 0 0 1-3 3"/><path d="M10 22h4"/><path d="M12 15v7"/></svg>',
};

export type IconName = keyof typeof ICONS;
