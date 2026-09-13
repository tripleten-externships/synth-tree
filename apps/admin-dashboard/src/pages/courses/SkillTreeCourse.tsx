import { useState } from "react";
import {
  SkillTree,
  createChildNode,
  deleteNode,
  updateNode,
  type SkillNode,
  type SkillTreeData,
} from "./SkillTree";
import { ORGANIC_TREE } from "./sampleTree";
import { applyPositions, loadPositions, savePositions } from "./skillTreePositions";

export default function Example() {
  const [data, setData] = useState<SkillTreeData>(() => applyPositions(ORGANIC_TREE, loadPositions()));
  const [editable, setEditable] = useState(false);

  const handleNodeClick = (node: SkillNode) => {
    // Locked nodes never reach here — SkillTree filters them out.
    console.log("open chapter:", node.id, node.title);
  };

  const handleAddChild = (parent: SkillNode, values: { title: string; url?: string }) => {
    setData((prev) => createChildNode(prev, parent.id, values));
  };

  const handleDeleteNode = (node: SkillNode) => {
    setData((prev) => deleteNode(prev, node.id));
    const positions = loadPositions();
    if (positions[node.id]) {
      delete positions[node.id];
      savePositions(positions);
    }
  };

  const handleUpdateNode = (id: string, updates: Partial<Pick<SkillNode, "title" | "url">>) => {
    setData((prev) => updateNode(prev, id, updates));
  };

  const handleMoveNode = (id: string, position: { x: number; y: number }) => {
    setData((prev) => updateNode(prev, id, position));
    const positions = loadPositions();
    positions[id] = position;
    savePositions(positions);
  };

  return (
    <div style={{ background: "#faf9f5", minHeight: "100vh", padding: 40 }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, fontFamily: "sans-serif" }}>
        <input
          type="checkbox"
          checked={editable}
          onChange={(e) => setEditable(e.target.checked)}
        />
        Admin mode (drag a node to reposition it, hover for +/×, click to rename or set its link)
      </label>
      <SkillTree
        data={data}
        width={520}
        height={800}
        onNodeClick={handleNodeClick}
        editable={editable}
        onAddChild={handleAddChild}
        onDeleteNode={handleDeleteNode}
        onUpdateNode={handleUpdateNode}
        onMoveNode={handleMoveNode}
      />
    </div>
  );
}
