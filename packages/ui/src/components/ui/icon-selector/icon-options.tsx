import type { IconName } from "../icon";

export type IconId = Extract<
  IconName,
  | "arrow"
  | "atom"
  | "cubes"
  | "waypoints"
  | "flask"
  | "beaker"
  | "plus"
  | "question"
>;

export const ICON_OPTIONS: { id: IconId; label: string }[] = [
  { id: "arrow", label: "Arrow" },
  { id: "atom", label: "Atom" },
  { id: "cubes", label: "Cubes" },
  { id: "waypoints", label: "Waypoints" },
  { id: "flask", label: "Flask" },
  { id: "beaker", label: "Beaker" },
  { id: "plus", label: "Plus" },
  { id: "question", label: "Help" },
];
