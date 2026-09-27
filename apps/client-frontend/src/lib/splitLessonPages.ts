import type { LessonBlocksByNodeQuery } from "@synth-tree/api-types";

/** A single lesson content block, as returned by the `lessonBlocksByNode` query. */
export type LessonBlock = NonNullable<LessonBlocksByNodeQuery["lessonBlocksByNode"]>[number];

/**
 * Split an ordered list of lesson blocks into pages at each PAGE_BREAK marker.
 *
 * PAGE_BREAK blocks are boundaries only: they start a new page and are never
 * rendered. Blocks are sorted by `order` first, so callers can pass the raw
 * query result. Empty pages (from a leading/trailing break, or two adjacent
 * breaks) are dropped. A lesson with no breaks yields a single page; an empty
 * lesson yields one empty page so the viewer always has a page to show.
 */
export function splitLessonPages(blocks: readonly LessonBlock[]): LessonBlock[][] {
  const ordered = [...blocks].sort((a, b) => a.order - b.order);

  const pages = ordered.reduce<LessonBlock[][]>(
    (acc, block) => {
      if (block.type === "PAGE_BREAK") {
        acc.push([]);
        return acc;
      }
      acc[acc.length - 1].push(block);
      return acc;
    },
    [[]],
  );

  const nonEmpty = pages.filter((page) => page.length > 0);
  return nonEmpty.length > 0 ? nonEmpty : [[]];
}
