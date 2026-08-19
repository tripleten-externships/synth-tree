import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Atom,
  Beaker,
  Bolt,
  Boxes,
  Check,
  CircleDot,
  Code,
  Dna,
  Eye,
  EyeOff,
  Flame,
  FlaskConical,
  GitFork,
  Grid3X3,
  Heart,
  HelpCircle,
  Image,
  Layout,
  List,
  Microscope,
  MoreHorizontal,
  Orbit,
  Pencil,
  Plus,
  Ruler,
  Search,
  Settings,
  Star,
  Trash2,
  Trophy,
  Video,
  Waves,
  Waypoints,
  Weight,
} from "lucide-react";

import { cn } from "@/utils";

export const ICON_NAMES = [
  "flask",
  "atom",
  "cubes",
  "fork",
  "arrow",
  "beaker",
  "question",
  "dna",
  "cell",
  "microscope",
  "bolt",
  "weight",
  "wave",
  "orbit",
  "ruler",
  "trophy",
  "fire",
  "heart",
  "star",
  "waypoints",
  "search",
  "eye",
  "eyeOff",
  "check",
  "plus",
  "back",
  "next",
  "list",
  "grid",
  "more",
  "trash",
  "settings",
  "edit",
  "image",
  "video",
  "code",
  "layout",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

const icons: Record<IconName, LucideIcon> = {
  flask: FlaskConical,
  atom: Atom,
  cubes: Boxes,
  fork: GitFork,
  arrow: ArrowDownRight,
  beaker: Beaker,
  question: HelpCircle,
  dna: Dna,
  cell: CircleDot,
  microscope: Microscope,
  bolt: Bolt,
  weight: Weight,
  wave: Waves,
  orbit: Orbit,
  ruler: Ruler,
  trophy: Trophy,
  fire: Flame,
  heart: Heart,
  star: Star,
  waypoints: Waypoints,
  search: Search,
  eye: Eye,
  eyeOff: EyeOff,
  check: Check,
  plus: Plus,
  back: ArrowLeft,
  next: ArrowRight,
  list: List,
  grid: Grid3X3,
  more: MoreHorizontal,
  trash: Trash2,
  settings: Settings,
  edit: Pencil,
  image: Image,
  video: Video,
  code: Code,
  layout: Layout,
};

export function Icon({ name, size = 24, strokeWidth = 1.25, className, ...rest }: IconProps) {
  const Lucide = icons[name];
  return (
    <Lucide
      {...rest}
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
    />
  );
}
