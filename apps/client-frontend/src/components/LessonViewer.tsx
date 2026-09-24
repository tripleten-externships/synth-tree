import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import { useMutation } from "@apollo/client/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLessonBlocksByNodeQuery } from "@synth-tree/api-types";
import { Button, toast } from "@synth-tree/ui";
import { START_NODE_PROGRESS } from "../graphql/mutations/startNodeProgress";
import { COMPLETE_NODE_PROGRESS } from "../graphql/mutations/completeNodeProgress";
import { splitLessonPages, type LessonBlock } from "../lib/splitLessonPages";
import QuizRunner from "./QuizRunner";
import type { QuizForRunner } from "./QuizRunner";

interface LessonViewerProps {
  nodeId: string;
  quiz?: QuizForRunner | null;
  onNext: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ nodeId, quiz, onNext }) => {
  const { data, loading, error } = useLessonBlocksByNodeQuery({
    variables: { nodeId },
  });

  const [startNodeProgress] = useMutation(START_NODE_PROGRESS);
  const [completeNodeProgress] = useMutation(COMPLETE_NODE_PROGRESS);

  const [finishing, setFinishing] = useState(false);

  async function handleFinish() {
    setFinishing(true);
    // Best-effort completion. If the node has a required quiz the learner hasn't
    // passed, the server rejects completion — don't block navigation on that,
    // but tell the learner why the lesson isn't marked complete.
    try {
      await completeNodeProgress({ variables: { nodeId } });
    } catch {
      // Node stays IN_PROGRESS; the quiz-pass path will complete it later.
      if (quiz?.required) {
        toast.info("Pass the quiz to complete this lesson");
      } else {
        toast.error("Couldn't save your progress");
      }
    } finally {
      setFinishing(false);
    }

    return onNext();
  }

  // Which lesson page is visible. Reset when the node changes so navigating
  // node-to-node never lands on a stale (possibly out-of-range) page index.
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    setCurrentPage(0);
  }, [nodeId]);

  // Start each page at the top, like turning a page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  // Mark this node as in-progress when the learner opens the lesson.
  // The mutation is idempotent server-side, so revisits / re-renders are safe.
  useEffect(() => {
    startNodeProgress({ variables: { nodeId } }).catch(() => {
      // Best-effort progress tracking — don't block the lesson on failure.
    });
  }, [nodeId, startNodeProgress]);

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div>Error loading lesson.</div>;

  // Check whether this lesson has a quiz.
  const hasQuiz = !!quiz;

  // A "page" is the run of blocks between PAGE_BREAK markers. No breaks -> one
  // page (renders exactly like before). pageIndex is clamped so a shorter
  // refetch can never leave us pointing past the last page.
  const pages = splitLessonPages(data?.lessonBlocksByNode ?? []);
  const totalPages = pages.length + (hasQuiz ? 1 : 0);
  const pageIndex = Math.min(currentPage, totalPages - 1);
  const currentBlocks = pages[pageIndex] ?? [];
  const isQuizPage = hasQuiz && pageIndex === pages.length;
  const isLastPage = pageIndex === totalPages - 1;

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

  const renderQuiz = (quiz: QuizForRunner) => <QuizRunner quiz={quiz} />;

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
      <div
        className="flex gap-1"
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={1}
        aria-valuemax={totalPages}
        aria-valuenow={pageIndex + 1}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= pageIndex ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {currentBlocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}

      {isQuizPage && quiz && renderQuiz(quiz)}

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Previous
        </Button>

        <p className="text-sm tabular-nums text-muted-foreground">
          {pageIndex + 1} of {totalPages}
        </p>

        <Button
          onClick={() => (isLastPage ? handleFinish() : setCurrentPage(pageIndex + 1))}
          disabled={finishing}
        >
          {isLastPage ? "Finish lesson" : "Continue"}
          {isLastPage ? (
            <Check className="ml-1.5 h-4 w-4" />
          ) : (
            <ArrowRight className="ml-1.5 h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
