import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import { useMutation } from "@apollo/client/react";
import { START_NODE_PROGRESS } from "../graphql/mutations/startNodeProgress";
import { useCompleteNodeProgressMutation, useLessonBlocksByNodeQuery } from "@synth-tree/api-types";
import { splitLessonPages, type LessonBlock } from "../lib/splitLessonPages";
import { Icon } from "@synth-tree/ui";

interface LessonViewerProps {
  nodeId: string;
  onNext: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ nodeId, onNext }) => {
  const { data, loading, error } = useLessonBlocksByNodeQuery({
    variables: { nodeId },
  });

  const [startNodeProgress] = useMutation(START_NODE_PROGRESS);
  const [completeNodeProgress] = useCompleteNodeProgressMutation();

  // When set, the lesson is complete and we show the finish screen (SYN-61)
  // instead of navigating away, so the learner sees the XP they just earned.
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  async function handleFinish() {
    // Best-effort completion. If the node has a required quiz the learner hasn't
    // passed, the server rejects completion — don't block navigation on that.
    try {
      const { data } = await completeNodeProgress({ variables: { nodeId } });
      // Completed: show the finish screen with the XP just awarded.
      setXpEarned(data?.completeNodeProgress?.xpAwarded ?? 0);
    } catch {
      // Node stays IN_PROGRESS; the quiz-pass path will complete it later.
      // Nothing was awarded, so skip the finish screen and just move on.
      onNext();
    }
  }

  // Which lesson page is visible. Reset when the node changes so navigating
  // node-to-node never lands on a stale (possibly out-of-range) page index.
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    setCurrentPage(0);
  }, [nodeId]);

  // Mark this node as in-progress when the learner opens the lesson.
  // The mutation is idempotent server-side, so revisits / re-renders are safe.
  useEffect(() => {
    startNodeProgress({ variables: { nodeId } }).catch(() => {
      // Best-effort progress tracking — don't block the lesson on failure.
    });
  }, [nodeId, startNodeProgress]);

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div>Error loading lesson.</div>;
  if (xpEarned !== null) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        {/* Green success checkmark — pops in on mount */}
        <div className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <Icon name="check" size={44} strokeWidth={3} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Lesson complete!</h2>

        {/* XP pill - pops in just after the checkmark. */}
        {xpEarned > 0 && (
          <span className="animate-pop-delayed inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-lg font-semibold text-primary-foreground">
            +{xpEarned} XP earned
          </span>
        )}
        <button
          type="button"
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg"
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    );
  }

  // A "page" is the run of blocks between PAGE_BREAK markers. No breaks -> one
  // page (renders exactly like before). pageIndex is clamped so a shorter
  // refetch can never leave us pointing past the last page.
  const pages = splitLessonPages(data?.lessonBlocksByNode ?? []);
  const pageIndex = Math.min(currentPage, pages.length - 1);
  const currentBlocks = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;

  const renderHTML = (html: string) => (
    <div
      className="leading-relaxed text-foreground"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );

  const renderImage = (url: string, caption?: string | null) => (
    <figure className="m-0 text-center">
      <img
        src={url}
        alt={caption || "Lesson image"}
        className="max-w-full h-auto rounded-lg shadow-md"
      />
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground italic">{caption}</figcaption>
      )}
    </figure>
  );

  const renderVideo = (url: string) => (
    <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-md">
      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer src={url} controls width="100%" height="100%" />
      </div>
    </div>
  );

  const ALLOWED_EMBED_HOSTS = new Set([
    "youtube.com",
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "youtube-nocookie.com",
    "vimeo.com",
    "www.vimeo.com",
    "player.vimeo.com",
    "codepen.io",
    "www.codepen.io",
  ]);

  const renderEmbed = (embedContent: string) => {
    let src = "";
    let title = "Embedded content";
    let allow: string | undefined;

    if (embedContent.trim().startsWith("<")) {
      const sanitized = DOMPurify.sanitize(embedContent, {
        ALLOWED_TAGS: ["iframe"],
        ALLOWED_ATTR: [
          "src",
          "title",
          "allow",
          "allowfullscreen",
          "frameborder",
          "loading",
          "referrerpolicy",
        ],
      });

      const doc = new DOMParser().parseFromString(sanitized, "text/html");
      const iframe = doc.querySelector("iframe");

      if (!iframe) return null;

      src = iframe.getAttribute("src") ?? "";
      title = iframe.getAttribute("title") || "Embedded content";
      allow = iframe.getAttribute("allow") || undefined;
    } else {
      src = embedContent;
    }

    if (!src) return null;

    let hostname: string;

    try {
      hostname = new URL(src).hostname;
    } catch {
      return null;
    }

    if (!ALLOWED_EMBED_HOSTS.has(hostname)) {
      return null;
    }

    return (
      <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden shadow-md">
        <iframe
          src={src}
          title={title}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow={allow}
          allowFullScreen
        />
      </div>
    );
  };

  const renderBlock = (block: LessonBlock) => {
    switch (block.type) {
      case "HTML":
        return renderHTML(block.html ?? "");
      case "IMAGE":
        return renderImage(block.url ?? "", block.caption);
      case "VIDEO":
        return renderVideo(block.url ?? "");
      case "EMBED":
        return renderEmbed(block.html ?? block.url ?? "");
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page progress: one segment per page, filled up to the current page. */}
      <div>
        <div className="flex gap-2" aria-label="Lesson progress">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= pageIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Page {pageIndex + 1} of {pages.length}
        </p>
      </div>

      {currentBlocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="px-6 py-3 font-semibold text-primary rounded-lg cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setCurrentPage(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
        >
          Back
        </button>

        <button
          type="button"
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold text-lg rounded-lg cursor-pointer transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          onClick={() => {
            if (isLastPage) {
              // Finishing the lesson: complete the node (best-effort) then advance.
              handleFinish();
            } else {
              setCurrentPage(pageIndex + 1);
            }
          }}
        >
          {isLastPage ? "Next" : "Next Page"}
        </button>
      </div>
    </div>
  );
};
