import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCompleteNodeProgressMutation, useLessonBlocksByNodeQuery } from "@synth-tree/api-types";
import { Button, toast } from "@synth-tree/ui";
import { START_NODE_PROGRESS } from "../graphql/mutations/startNodeProgress";
import { splitLessonPages } from "../lib/splitLessonPages";
import LessonReadBlocks from "./LessonReadBlocks";
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
  const [completeNodeProgress] = useCompleteNodeProgressMutation();

  const [finishing, setFinishing] = useState(false);
  // When set, the lesson is complete and we show the finish screen (SYN-61)
  // instead of navigating away, so the learner sees the XP they just earned.
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  async function handleFinish() {
    setFinishing(true);
    // Best-effort completion. If the node has a required quiz the learner hasn't
    // passed, the server rejects completion — don't block navigation on that,
    // but tell the learner why the lesson isn't marked complete.
    try {
      const { data } = await completeNodeProgress({ variables: { nodeId } });
      // Completed: show the finish screen with the XP just awarded (SYN-61)
      // instead of navigating away.
      setXpEarned(data?.completeNodeProgress?.xpAwarded ?? 0);
    } catch {
      // Node stays IN_PROGRESS; the quiz-pass path will complete it later.
      if (quiz?.required) {
        toast.info("Pass the quiz to complete this lesson");
      } else {
        toast.error("Couldn't save your progress");
      }
      onNext();
    } finally {
      setFinishing(false);
    }
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

  // Lesson finished: show the XP reward screen (SYN-61).
  if (xpEarned !== null) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        {/* Green success checkmark — pops in on mount */}
        <div className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <Check className="h-11 w-11 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Lesson complete!</h2>

        {/* XP pill — pops in just after the checkmark. Hidden when nothing was awarded. */}
        {xpEarned > 0 && (
          <span className="animate-pop-delayed inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-lg font-semibold text-primary-foreground">
            +{xpEarned} XP earned
          </span>
        )}

        <Button onClick={onNext}>Continue</Button>
      </div>
    );
  }

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

      <LessonReadBlocks blocks={currentBlocks} />

      {isQuizPage && quiz && <QuizRunner quiz={quiz} />}

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
