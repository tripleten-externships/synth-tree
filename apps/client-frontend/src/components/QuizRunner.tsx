import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Input } from "@synth-tree/ui";
import { SUBMIT_QUIZ_ATTEMPT } from "../graphql/mutations/submitQuizAttempt";
import QuizSingle from "./QuizSingle";
import QuizMulti from "./QuizMulti";

type QuizOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  explanation?: string | null;
  type: string; // SINGLE_CHOICE | MULTIPLE_CHOICE | OPEN_QUESTION | FILL
  options: QuizOption[];
  // FILL only; revealed post-submit by the server's answer-key guard.
  canonicalAnswer?: string | null;
};

export type QuizForRunner = {
  id: string;
  title?: string | null;
  required: boolean;
  questions: QuizQuestion[];
};

type SubmittedAnswer = {
  id: string;
  questionId: string;
  answer?: {
    selectedOptionIds?: string[];
    text?: string;
  } | null;
  isCorrect?: boolean | null;
  question: QuizQuestion;
};

type QuizAttemptResult = {
  id: string;
  passed: boolean | null;
  answers: SubmittedAnswer[];
};

type SubmitResult = {
  submitQuizAttempt: QuizAttemptResult | null;
};

// Question types answered with free text; every other type is answered by
// selecting options.
const TEXT_ANSWER_TYPES = new Set(["OPEN_QUESTION", "FILL"]);
const isTextAnswer = (type: string) => TEXT_ANSWER_TYPES.has(type);

function ResultSummary({ result }: { result: QuizAttemptResult }) {
  const incorrectCount = result.answers.filter((answer) => answer.isCorrect === false).length;
  const isPendingReview = result.passed === null;

  return (
    <div
      className={`rounded-2xl p-5 ${
        isPendingReview
          ? "bg-[hsl(var(--warning)/0.1)]"
          : result.passed
            ? "bg-[hsl(var(--success)/0.1)]"
            : "bg-[hsl(var(--destructive)/0.1)]"
      }`}
    >
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          isPendingReview ? "text-warning" : result.passed ? "text-success" : "text-destructive"
        }`}
      >
        Quiz submitted
      </p>

      <h3 className="mt-1 text-2xl font-bold text-foreground">
        {isPendingReview ? "Waiting for review" : result.passed ? "You passed!" : "Keep practicing"}
      </h3>

      {isPendingReview ? (
        <p className="mt-2 text-sm text-warning">
          Your written answer was submitted and is waiting for manual review.
        </p>
      ) : result.passed ? (
        <p className="mt-2 text-sm text-success">You have completed this quiz.</p>
      ) : (
        <p className="mt-2 text-sm text-foreground">
          Review the questions above, then retry when you are ready.
        </p>
      )}

      {result.passed === false && incorrectCount > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          {incorrectCount} question
          {incorrectCount === 1 ? " was" : "s were"} incorrect.
        </p>
      )}
    </div>
  );
}

export default function QuizRunner({ quiz }: { quiz: QuizForRunner }) {
  const [choice, setChoice] = useState<Record<string, string[]>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [showAnswerError, setShowAnswerError] = useState(false);

  const submitted = !!result;
  const isPendingReview = result?.passed === null;

  const allQuestionsAnswered = quiz.questions.every((q) =>
    isTextAnswer(q.type) ? !!text[q.id]?.trim() : (choice[q.id] ?? []).length > 0,
  );

  const [submit, { loading, error }] = useMutation<SubmitResult>(SUBMIT_QUIZ_ATTEMPT);

  const toggle = (qId: string, optId: string, multiple: boolean) =>
    setChoice((prev) => {
      const cur = prev[qId] ?? [];

      if (multiple) {
        return {
          ...prev,
          [qId]: cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId],
        };
      }

      return {
        ...prev,
        [qId]: [optId],
      };
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allQuestionsAnswered) {
      setShowAnswerError(true);
      return;
    }

    setShowAnswerError(false);

    // Structured answers for the typed QuizAnswerInput (SYN-33); the results
    // summary and per-question feedback are driven by the returned attempt.
    const answers = quiz.questions.map((q) => ({
      questionId: q.id,
      ...(isTextAnswer(q.type)
        ? { text: text[q.id] ?? "" }
        : { selectedOptionIds: choice[q.id] ?? [] }),
    }));

    const res = await submit({
      variables: {
        quizId: quiz.id,
        answers,
      },
    });

    setResult(res.data?.submitQuizAttempt ?? null);
  };

  const onRetry = () => {
    setChoice({});
    setText({});
    setResult(null);
    setShowAnswerError(false);
  };

  const renderQuestion = (q: QuizQuestion, questionNumber: number, correctOptionIds: string[]) => {
    switch (q.type) {
      case "OPEN_QUESTION":
        return (
          <>
            <p className="mb-2 font-medium text-foreground">
              {questionNumber}. {q.prompt}
            </p>
            <textarea
              value={text[q.id] ?? ""}
              onChange={(e) =>
                setText((p) => ({
                  ...p,
                  [q.id]: e.target.value,
                }))
              }
              rows={3}
              disabled={submitted}
              placeholder="Your answer…"
              className="w-full rounded-lg border border-border p-2 text-sm focus:border-primary focus:outline-none"
            />
          </>
        );
      case "FILL":
        return (
          <>
            <p className="mb-2 font-medium text-foreground">
              {questionNumber}. {q.prompt}
            </p>
            <Input
              type="text"
              value={text[q.id] ?? ""}
              onChange={(e) =>
                setText((p) => ({
                  ...p,
                  [q.id]: e.target.value,
                }))
              }
              disabled={submitted}
              placeholder="Your answer…"
            />
          </>
        );
      case "SINGLE_CHOICE":
        return (
          <QuizSingle
            question={q}
            questionNumber={questionNumber}
            choice={choice[q.id] ?? []}
            onToggle={(optionId) => toggle(q.id, optionId, false)}
            submitted={submitted}
            correctOptionIds={correctOptionIds}
          />
        );
      case "MULTIPLE_CHOICE":
        return (
          <QuizMulti
            question={q}
            questionNumber={questionNumber}
            choice={choice[q.id] ?? []}
            onToggle={(optionId) => toggle(q.id, optionId, true)}
            submitted={submitted}
            correctOptionIds={correctOptionIds}
          />
        );
      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        {quiz.title ?? "Quiz"}
        {quiz.required ? " · required" : ""}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {quiz.questions.map((q, i) => {
          const submittedAnswer = result?.answers.find((answer) => answer.questionId === q.id);
          const correctOptionIds =
            submittedAnswer?.question.options
              .filter((option) => option.isCorrect)
              .map((option) => option.id) ?? [];

          return (
            <div key={q.id}>
              {renderQuestion(q, i + 1, correctOptionIds)}

              {/* Open questions are graded manually, so they get no inline feedback. */}
              {submitted && q.type !== "OPEN_QUESTION" && (
                <div
                  className={`mt-4 rounded-xl px-4 py-4 ${
                    submittedAnswer?.isCorrect
                      ? "bg-[hsl(var(--success)/0.1)]"
                      : "bg-[hsl(var(--destructive)/0.1)]"
                  }`}
                >
                  <strong>{submittedAnswer?.isCorrect ? "Correct." : "Incorrect."}</strong>{" "}
                  {q.type === "FILL" && !submittedAnswer?.isCorrect && (
                    <>
                      Correct answer:{" "}
                      {submittedAnswer?.question.canonicalAnswer?.trim() || "Not available"}.{" "}
                    </>
                  )}
                  {submittedAnswer?.question.explanation}
                </div>
              )}
            </div>
          );
        })}

        {result && <ResultSummary result={result} />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || submitted}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit quiz"}
          </button>

          {showAnswerError && (
            <span className="rounded-xl bg-[hsl(var(--destructive)/0.1)] px-4 py-4">
              Please answer all questions
            </span>
          )}

          {/* No retry while an attempt is awaiting manual review. */}
          {submitted && !isPendingReview && (
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              onClick={onRetry}
            >
              Retry
            </button>
          )}

          {error && <span className="text-sm text-destructive">Could not submit.</span>}
        </div>
      </form>
    </section>
  );
}
