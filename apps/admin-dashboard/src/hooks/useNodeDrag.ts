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

// Minimum pointer travel (in CSS px) before a press becomes a drag. Anything
// shorter is treated as a click: no local move and no onDrop, so simply
// clicking a node never snaps/persists it (and leaves room for click-to-select).
const DRAG_THRESHOLD_PX = 4;

// The pointer that pressed a node. It only becomes a visible drag (`active`)
// once it has travelled DRAG_THRESHOLD_PX from where it went down.
interface Press {
  id: string;
  pointerId: number;
  el: HTMLElement; // element holding pointer capture for this press
  startClientX: number;
  startClientY: number;
  active: boolean;
}

export function useNodeDrag({ gridStep = 5, onDrop }: UseNodeDragOptions) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  // Mirror of `drag` so pointermove/up handlers can read the latest value
  // without being re-created (keeps their identity stable across the drag).
  const dragRef = useRef<DragState | null>(null);
  const pressRef = useRef<Press | null>(null);
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

  // The press owned by this event's pointer, or null for any other pointer
  // (e.g. a second finger) so it can't hijack or end the active drag.
  const pressFor = (e: React.PointerEvent<HTMLElement>) => {
    const press = pressRef.current;
    return press && press.pointerId === e.pointerId ? press : null;
  };

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>, node: NodePosition) => {
      if (e.button !== 0) return; // primary button / touch only
      // One drag at a time: ignore extra pointers while a press is live. A press
      // whose element lost capture without a pointerup/cancel reaching us (e.g.
      // the node unmounted mid-drag) is stale and gets replaced.
      const prev = pressRef.current;
      if (prev) {
        if (prev.el.isConnected && prev.el.hasPointerCapture(prev.pointerId)) return;
        pressRef.current = null;
        setDragBoth(null);
      }
      const p = pointerToPercent(e.clientX, e.clientY);
      if (!p) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      grabOffset.current = { dx: node.posX - p.x, dy: node.posY - p.y };
      pressRef.current = {
        id: node.id,
        pointerId: e.pointerId,
        el: e.currentTarget,
        startClientX: e.clientX,
        startClientY: e.clientY,
        active: false,
      };
    },
    [pointerToPercent, setDragBoth],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const press = pressFor(e);
      if (!press) return;
      if (!press.active) {
        const moved = Math.hypot(e.clientX - press.startClientX, e.clientY - press.startClientY);
        if (moved < DRAG_THRESHOLD_PX) return;
        press.active = true;
      }
      const p = pointerToPercent(e.clientX, e.clientY);
      if (!p) return;
      setDragBoth({
        id: press.id,
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
      const press = pressFor(e);
      if (!press) return;
      releaseCapture(e);
      pressRef.current = null;
      const cur = dragRef.current;
      setDragBoth(null);
      // Sub-threshold press (a click): nothing moved, nothing to persist.
      if (!press.active || !cur) return;
      onDrop(cur.id, snapPct(cur.posX, gridStep), snapPct(cur.posY, gridStep));
    },
    [gridStep, onDrop, setDragBoth],
  );

  // Pointer cancelled (interrupted gesture): abandon the drag without
  // persisting — the node falls back to its stored position.
  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!pressFor(e)) return;
      releaseCapture(e);
      pressRef.current = null;
      setDragBoth(null);
    },
    [setDragBoth],
  );

  return { canvasRef, drag, onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
