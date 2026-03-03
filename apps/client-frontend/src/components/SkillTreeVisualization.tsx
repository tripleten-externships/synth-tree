import React from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "react-flow-renderer";
import type { Node as RFNode, Edge as RFEdge } from "react-flow-renderer";

interface SkillNodeData {
  id: string;
  title: string;
  posX: number;
  posY: number;
  status: "completed" | "unlocked" | "locked";
  prerequisiteTitle?: string;
}

interface SkillEdgeData {
  fromNodeId: string;
  toNodeId: string;
}

interface SkillTreeVisualizationProps {
  nodesData: SkillNodeData[];
  edgesData: SkillEdgeData[];
  onNodeClick?: (nodeId: string) => void;
}

const SkillTreeVisualization: React.FC<SkillTreeVisualizationProps> = ({
  nodesData,
  edgesData,
  onNodeClick,
}) => {
  // Correctly type the nodes: RFNode<{ label: string }>
  const nodes: RFNode<{ label: string }>[] = nodesData.map((node) => ({
    id: node.id,
    data: { label: node.title },
    position: { x: node.posX, y: node.posY },
    style: {
      background:
        node.status === "completed"
          ? "green"
          : node.status === "unlocked"
            ? "blue"
            : "gray",
      color: "#fff",
      borderRadius: 8,
      padding: 10,
      width: 120,
      textAlign: "center",
      cursor: node.status === "unlocked" ? "pointer" : "not-allowed",
    },
  }));

  const edges: RFEdge[] = edgesData.map((edge) => ({
    id: `e-${edge.fromNodeId}-${edge.toNodeId}`,
    source: edge.fromNodeId,
    target: edge.toNodeId,
    animated: true,
    style: { stroke: "#555" },
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  const handleNodeClick = (
    event: React.MouseEvent,
    node: RFNode<{ label: string }>,
  ) => {
    const clickedNode = nodesData.find((n) => n.id === node.id);
    if (!clickedNode) return;

    if (clickedNode.status === "unlocked" && onNodeClick) {
      onNodeClick(clickedNode.id);
    } else if (clickedNode.status === "locked") {
      alert(
        `Complete "${clickedNode.prerequisiteTitle || "prerequisite"}" first`,
      );
    }
  };

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={handleNodeClick}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default SkillTreeVisualization;
