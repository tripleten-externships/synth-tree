import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@synth-tree/ui";
import SkillTreeCanvas from "./SkillTreeCanvas";
import {
  deriveSkillTree,
  nodeHref,
  type CanvasNode,
  type RawSkillNode,
} from "../lib/deriveSkillTree";

export interface CourseSkillTreeProps {
  courseId: string;
  nodes: RawSkillNode[];
}

// A course's skill tree with node states applied and click navigation wired:
// unlocked / in-progress / completed nodes open the lesson, locked nodes
// explain why they can't be opened yet (SYN-29).
export default function CourseSkillTree({ courseId, nodes }: CourseSkillTreeProps) {
  const navigate = useNavigate();
  const tree = useMemo(() => deriveSkillTree(nodes), [nodes]);

  const onNodeClick = (node: CanvasNode) => {
    const href = nodeHref(courseId, node);
    if (!href) {
      toast.info("Complete prerequisites first");
      return;
    }
    navigate(href);
  };

  return <SkillTreeCanvas nodes={tree.nodes} edges={tree.edges} onNodeClick={onNodeClick} />;
}
