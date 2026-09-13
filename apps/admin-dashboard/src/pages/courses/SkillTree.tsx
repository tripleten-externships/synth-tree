import React, { useEffect, useMemo, useRef, useState } from "react";
import { ICONS } from "./icons";
import "./SkillTree.css";

/* ============================================================
 * Types
 * ============================================================ */

export type NodeStatus = "completed" | "current" | "unlocked" | "locked";

export interface SkillNode {
  /** Unique id, referenced by edges. */
  id: string;
  /** Label shown under the hex. */
  title: string;
  /** Icon key from `ICONS` (or your own map). Falls back to a letter. */
  icon?: string;
  /** Position on the canvas, 0–100 (percent of width / height). */
  x: number;
  y: number;
  status: NodeStatus;
  /** Optional meta shown under the label. */
  lessons?: number;
  xp?: number;
  /** Renders larger — use for a capstone / "boss" node. */
  isBoss?: boolean;
  /** When set, clicking the node (in view mode) opens this URL in a new tab. */
  url?: string;
}

/** An edge is a [fromId, toId] pair. */
export type SkillEdge = [string, string];

export interface SkillTreeData {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export interface SkillTreeProps {
  data: SkillTreeData;
  /** Canvas size in px. Nodes are placed by percentage within this box. */
  width?: number;
  height?: number;
  /** Fired when a non-locked node is clicked. */
  onNodeClick?: (node: SkillNode) => void;
  /**
   * Admin/builder mode: hovering a node reveals "+" (add child) and "×"
   * (delete) buttons on the hex; clicking the hex itself opens a small
   * popover anchored to it for editing name/URL.
   */
  editable?: boolean;
  /** Fired when a new child's name/URL popover is submitted. */
  onAddChild?: (parent: SkillNode, values: { title: string; url?: string }) => void;
  /** Fired when the "×" delete button is clicked on a node. */
  onDeleteNode?: (node: SkillNode) => void;
  /** Fired when an existing node's edit popover is submitted. */
  onUpdateNode?: (id: string, updates: Partial<Pick<SkillNode, "title" | "url">>) => void;
  /** Fired once, on release, after dragging a node to a new spot. */
  onMoveNode?: (id: string, position: { x: number; y: number }) => void;
  /** Extra className on the root. */
  className?: string;
  style?: React.CSSProperties;
}

/* ============================================================
 * Structural mutation helper
 * ------------------------------------------------------------
 * Pure, immutable helper for adding a child node + prerequisite
 * edge to a SkillTreeData. Mirrors the shape of a backend
 * createSkillNode + createSkillNodePrerequisite call so it can be
 * swapped for real mutations later without touching the canvas.
 * ============================================================ */

function nextNodeId(nodes: SkillNode[]): string {
  const max = nodes.reduce((m, n) => {
    const match = /^n(\d+)$/.exec(n.id);
    return match ? Math.max(m, parseInt(match[1], 10)) : m;
  }, 0);
  return `n${max + 1}`;
}

export function createChildNode(
  data: SkillTreeData,
  parentId: string,
  overrides?: Partial<Omit<SkillNode, "id">>,
): SkillTreeData {
  const parent = data.nodes.find((n) => n.id === parentId);
  if (!parent) return data;

  const siblingCount = data.edges.filter(([from]) => from === parentId).length;
  const id = nextNodeId(data.nodes);
  const child: SkillNode = {
    title: "New skill",
    status: "locked",
    x: Math.min(96, Math.max(4, parent.x + siblingCount * 14 - 7)),
    y: Math.min(100, parent.y + 12),
    ...overrides,
    id,
  };

  return {
    nodes: [...data.nodes, child],
    edges: [...data.edges, [parentId, id]],
  };
}

/**
 * Removes a node and every edge touching it (as prerequisite or
 * dependent). Does not cascade to descendants — they're left in
 * place, just no longer gated by this node.
 */
export function deleteNode(data: SkillTreeData, nodeId: string): SkillTreeData {
  return {
    nodes: data.nodes.filter((n) => n.id !== nodeId),
    edges: data.edges.filter(([a, b]) => a !== nodeId && b !== nodeId),
  };
}

/** Patches title/url (or other fields) on a single node, immutably. */
export function updateNode(
  data: SkillTreeData,
  nodeId: string,
  updates: Partial<Omit<SkillNode, "id">>,
): SkillTreeData {
  return {
    ...data,
    nodes: data.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
  };
}

/* ============================================================
 * Hex badge
 * ============================================================ */

interface HexProps {
  icon?: string;
  status: NodeStatus;
  size?: number;
  /** Fallback glyph when no icon matches. */
  glyphChar?: string;
}

export function Hex({ icon, status, size = 64, glyphChar }: HexProps) {
  const svg = icon ? ICONS[icon] : undefined;
  return (
    <div className={`st-hex ${status}`} style={{ ["--s" as string]: `${size}px` }}>
      <div className="st-hex-shape" />
      <div className="st-hex-glyph">
        {svg ? (
          <span dangerouslySetInnerHTML={{ __html: svg }} />
        ) : glyphChar ? (
          <span style={{ fontWeight: 700, fontSize: size * 0.4 }}>{glyphChar}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ============================================================
 * SkillTree
 * ============================================================ */

/** Which node the name/URL popover is anchored to, and what it's doing. */
type PopoverState =
  | { mode: "create"; parentId: string }
  | { mode: "edit"; nodeId: string };

export function SkillTree({
  data,
  width = 520,
  height = 800,
  onNodeClick,
  editable = false,
  onAddChild,
  onDeleteNode,
  onUpdateNode,
  onMoveNode,
  className,
  style,
}: SkillTreeProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");

  // Live drag preview: holds the dragged node's in-progress position so we
  // don't have to push every pointermove up into the caller's data. Commit
  // happens once, via onMoveNode, on release.
  const [dragPos, setDragPos] = useState<{ id: string; x: number; y: number } | null>(null);
  const dragRef = useRef<{
    id: string;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const justDraggedRef = useRef(false);

  const nodeMap = useMemo(
    () => Object.fromEntries(data.nodes?.map((n) => [n.id, n])) as Record<string, SkillNode>,
    [data.nodes],
  );

  const anchorId = popover ? (popover.mode === "edit" ? popover.nodeId : popover.parentId) : null;
  const anchorNode = anchorId ? nodeMap[anchorId] : undefined;

  // Seed the form whenever a new popover opens (not on every data change).
  useEffect(() => {
    if (!popover) return;
    if (popover.mode === "edit") {
      const node = nodeMap[popover.nodeId];
      setFormTitle(node?.title ?? "");
      setFormUrl(node?.url ?? "");
    } else {
      setFormTitle("");
      setFormUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popover]);

  // Escape closes the popover without needing to hit empty canvas.
  useEffect(() => {
    if (!editable) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopover(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editable]);

  // percent coords -> px
  const xy = (n: { x: number; y: number }) => ({ x: (n.x / 100) * width, y: (n.y / 100) * height });
  // Live position, accounting for an in-progress drag.
  const posOf = (n: { id: string; x: number; y: number }) => (dragPos?.id === n.id ? dragPos : n);

  const handleClick = (n: SkillNode) => {
    if (editable) {
      setPopover({ mode: "edit", nodeId: n.id });
      return;
    }
    if (n.status === "locked") return;
    onNodeClick?.(n);
    if (n.url) window.open(n.url, "_blank", "noopener,noreferrer");
  };

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const DRAG_THRESHOLD_PX = 4;

  const handlePointerDown = (e: React.PointerEvent, n: SkillNode) => {
    if (!editable) return;
    if ((e.target as HTMLElement).closest(".st-node-action")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: n.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: n.x,
      startY: n.y,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent, n: SkillNode) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== n.id) return;
    const dxPx = e.clientX - drag.startClientX;
    const dyPx = e.clientY - drag.startClientY;
    if (!drag.moved) {
      if (Math.hypot(dxPx, dyPx) < DRAG_THRESHOLD_PX) return;
      drag.moved = true;
    }
    const x = clamp(drag.startX + (dxPx / width) * 100, 2, 98);
    const y = clamp(drag.startY + (dyPx / height) * 100, 2, 98);
    setDragPos({ id: n.id, x, y });
  };

  const handlePointerUp = (e: React.PointerEvent, n: SkillNode) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== n.id) return;
    justDraggedRef.current = drag.moved;
    if (drag.moved) {
      const x = clamp(drag.startX + (e.clientX - drag.startClientX) / width * 100, 2, 98);
      const y = clamp(drag.startY + (e.clientY - drag.startClientY) / height * 100, 2, 98);
      onMoveNode?.(n.id, { x, y });
    }
    dragRef.current = null;
    setDragPos(null);
  };

  const submitPopover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popover) return;
    const title = formTitle.trim() || "New skill";
    const url = formUrl.trim() || undefined;
    if (popover.mode === "create") {
      const parent = nodeMap[popover.parentId];
      if (parent) onAddChild?.(parent, { title, url });
    } else {
      onUpdateNode?.(popover.nodeId, { title, url });
    }
    setPopover(null);
  };

  return (
    <div className={`st-root ${className ?? ""}`} style={style}>
      <div
        className="st-canvas"
        style={{ width, height }}
        onClick={() => editable && setPopover(null)}
      >
        {/* Edges — cubic-bézier connectors drawn behind the nodes */}
        <svg className="st-edges" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {data.edges.map(([a, b], i) => {
            const from = nodeMap[a];
            const to = nodeMap[b];
            if (!from || !to) return null;
            const A = xy(posOf(from));
            const B = xy(posOf(to));
            const active = from.status === "completed" && to.status !== "locked";
            const midY = (A.y + B.y) / 2;
            // In the builder, structure matters more than lesson progress —
            // every prerequisite edge reads as a clear solid line so a new
            // child's link to its parent is obvious the moment it's added.
            const stroke = editable || active ? "hsl(var(--st-primary))" : "hsl(var(--st-border))";
            const strokeWidth = editable ? 2.5 : active ? 3 : 2;
            const dash = editable || from.status === "completed" ? "0" : "4 6";
            return (
              <path
                key={i}
                d={`M ${A.x} ${A.y} C ${A.x} ${midY}, ${B.x} ${midY}, ${B.x} ${B.y}`}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {data.nodes.map((n) => {
          const isDragging = dragPos?.id === n.id;
          const { x, y } = xy(posOf(n));
          const isActive = editable && anchorId === n.id;
          const isInteractive = editable || n.status !== "locked";
          return (
            <div
              key={n.id}
              className={`st-node ${n.status} ${isActive ? "active" : ""} ${editable ? "draggable" : ""} ${isDragging ? "dragging" : ""}`}
              style={{ left: x, top: y }}
              onPointerDown={(e) => handlePointerDown(e, n)}
              onPointerMove={(e) => handlePointerMove(e, n)}
              onPointerUp={(e) => handlePointerUp(e, n)}
              onClick={(e) => {
                e.stopPropagation();
                if (justDraggedRef.current) {
                  justDraggedRef.current = false;
                  return;
                }
                handleClick(n);
              }}
              role="button"
              tabIndex={isInteractive ? 0 : -1}
              aria-disabled={!isInteractive}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(n);
                }
              }}
            >
              <div className="st-node-hex-wrap">
                <Hex
                  icon={n.icon}
                  status={n.status}
                  size={n.isBoss ? 88 : 64}
                  glyphChar={n.title.charAt(0)}
                />
                {editable && (
                  <div className="st-node-actions">
                    <button
                      type="button"
                      className="st-node-action add"
                      title={`Add child skill under "${n.title}"`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopover({ mode: "create", parentId: n.id });
                      }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="st-node-action delete"
                      title={`Delete "${n.title}"`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode?.(n);
                        if (anchorId === n.id) setPopover(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className={`st-node-label ${!editable && n.url ? "has-link" : ""}`} style={{ fontWeight: n.isBoss ? 700 : 500 }}>
                {n.title}
              </div>
              {n.status !== "locked" && (
                <div className="st-node-meta">
                  {n.status === "completed" ? `+${n.xp ?? 0} XP` : `${n.lessons ?? 0} lessons`}
                </div>
              )}
            </div>
          );
        })}

        {popover && anchorNode && (() => {
          const { x, y } = xy(posOf(anchorNode));
          const hexH = (anchorNode.isBoss ? 88 : 64) * 1.155;
          const below = y - hexH / 2 < 150;
          const top = below ? y + hexH / 2 + 10 : y - hexH / 2 - 10;
          return (
            <form
              className={`st-popover ${below ? "below" : ""}`}
              style={{ left: x, top }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={submitPopover}
            >
              <div className="st-popover-title">
                {popover.mode === "create" ? "Add child skill" : "Edit skill"}
              </div>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Skill name"
                autoFocus
              />
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https:// link (optional)"
              />
              <div className="st-popover-actions">
                <button type="button" onClick={() => setPopover(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {popover.mode === "create" ? "Add" : "Save"}
                </button>
              </div>
            </form>
          );
        })()}
      </div>
    </div>
  );
}

export default SkillTree;
