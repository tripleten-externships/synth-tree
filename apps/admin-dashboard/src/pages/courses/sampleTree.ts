import type { SkillTreeData } from "../courses/SkillTree";

// Positions are percentages (0–100) of the canvas box, so the layout
// scales with whatever width/height you pass to <SkillTree>.
export const ORGANIC_TREE: SkillTreeData = {
  nodes: [
    { id: "n1", title: "Intro to Organic Chemistry", icon: "flask", x: 50, y: 6, status: "completed", lessons: 3, xp: 60, url: "https://en.wikipedia.org/wiki/Organic_chemistry" },
    { id: "n2", title: "Atomic structure & orbitals", icon: "atom", x: 50, y: 18, status: "completed", lessons: 4, xp: 80 },
    { id: "n3", title: "Bonding", icon: "fork", x: 30, y: 30, status: "completed", lessons: 3, xp: 60 },
    { id: "n4", title: "Lewis structures", icon: "arrow", x: 70, y: 30, status: "completed", lessons: 4, xp: 80 },
    { id: "n5", title: "Hybridization", icon: "beaker", x: 30, y: 42, status: "current", lessons: 5, xp: 100 },
    { id: "n6", title: "Resonance", icon: "wave", x: 70, y: 42, status: "unlocked", lessons: 4, xp: 80 },
    { id: "n7", title: "Molecular geometry", icon: "cubes", x: 50, y: 54, status: "locked", lessons: 5, xp: 100 },
    { id: "n8", title: "Polarity & IMFs", icon: "orbit", x: 30, y: 66, status: "locked", lessons: 4, xp: 80 },
    { id: "n9", title: "Stereochemistry", icon: "ruler", x: 70, y: 66, status: "locked", lessons: 6, xp: 120 },
    { id: "n10", title: "Reaction mechanisms", icon: "fork", x: 50, y: 78, status: "locked", lessons: 6, xp: 120 },
    { id: "n11", title: "Synthesis capstone", icon: "trophy", x: 50, y: 92, status: "locked", lessons: 8, xp: 200, isBoss: true },
  ],
  edges: [
    ["n1", "n2"], ["n2", "n3"], ["n2", "n4"],
    ["n3", "n5"], ["n4", "n6"],
    ["n5", "n7"], ["n6", "n7"],
    ["n7", "n8"], ["n7", "n9"],
    ["n8", "n10"], ["n9", "n10"],
    ["n10", "n11"],
  ],
};
