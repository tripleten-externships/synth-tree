import { useCallback, useRef, useState } from "react";

// SYN-66: pointer-based drag to reposition a skill node on the builder canvas.
// This hook owns all the pointer math and is deliberately visual-agnostic so it
// can wrap whatever node component SYN-65 ships. Coordinates are integer
// percentages (0-100) matching SkillNode.posX / posY; on drop they are snapped
// to a grid and clamped to bounds before being handed to `onDrop`.

export interface DragState {
  id: string;
  posX: number; // live percent while dragging (clamped 0-100, not yet snapped)
  posY: number;
}

interface NodePosition {
  id: string;
  posX: number;
  posY: number;
}

interface UseNodeDragOptions {
  /** Grid increment, in percent, that a node snaps to on drop. */
  gridStep?: number;
  /** Called on drag-end with the final snapped + clamped integer coordinates. */
  onDrop: (id: string, posX: number, posY: number) => void;
}

const clampPct = (v: number) => Math.min(100, Math.max(0, v));
const snapPct = (v: number, step: number) => clampPct(Math.round(v / step) * step);

export function useNodeDrag({ gridStep = 5, onDrop }: UseNodeDragOptions) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  // Mirror of `drag` so pointermove/up handlers can read the latest value
  // without being re-created (keeps their identity stable across the drag).
  const dragRef = useRef<DragState | null>(null);
  // Offset (in percent) between the pointer and the node's origin at grab time,
  // so the node tracks the cursor instead of snapping its center under it.
  const grabOffset = useRef({ dx: 0, dy: 0 });

  const setDragBoth = useCallback((next: DragState | null) => {
    dragRef.current = next;
    setDrag(next);
  }, []);

  const pointerToPercent = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>, node: NodePosition) => {
      if (e.button !== 0) return; // primary button / touch only
      const p = pointerToPercent(e.clientX, e.clientY);
      if (!p) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      grabOffset.current = { dx: node.posX - p.x, dy: node.posY - p.y };
      setDragBoth({ id: node.id, posX: node.posX, posY: node.posY });
    },
    [pointerToPercent, setDragBoth],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const cur = dragRef.current;
      if (!cur) return;
      const p = pointerToPercent(e.clientX, e.clientY);
      if (!p) return;
      setDragBoth({
        id: cur.id,
        posX: clampPct(p.x + grabOffset.current.dx),
        posY: clampPct(p.y + grabOffset.current.dy),
      });
    },
    [pointerToPercent, setDragBoth],
  );

  const releaseCapture = (e: React.PointerEvent<HTMLElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already be gone (e.g. pointer left the window); ignore.
    }
  };

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const cur = dragRef.current;
      if (!cur) return;
      releaseCapture(e);
      const posX = snapPct(cur.posX, gridStep);
      const posY = snapPct(cur.posY, gridStep);
      setDragBoth(null);
      onDrop(cur.id, posX, posY);
    },
    [gridStep, onDrop, setDragBoth],
  );

  // Pointer cancelled (interrupted gesture): abandon the drag without
  // persisting — the node falls back to its stored position.
  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!dragRef.current) return;
      releaseCapture(e);
      setDragBoth(null);
    },
    [setDragBoth],
  );

  return { canvasRef, drag, onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
