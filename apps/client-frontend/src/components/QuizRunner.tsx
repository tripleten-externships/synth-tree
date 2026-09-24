import { useState } from "react";
import { useMutation } from "@apollo/client/react";
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
  type: string; // SINGLE_CHOICE | MULTIPLE_CHOICE | OPEN_QUESTION
  options: QuizOption[];
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

export default function QuizRunner({ quiz }: { quiz: QuizForRunner }) {
  const [choice, setChoice] = useState<Record<string, string[]>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const submitted = !!result;
  const hasIncorrectAnswer = result?.answers.some(
  (answer) => answer.isCorrect === false
  );
  const allQuestionsAnswered = quiz.questions.every((q) => {
  if (q.type === "OPEN_QUESTION") {
    return !!text[q.id]?.trim();
  }

    return (choice[q.id] ?? []).length > 0;
  });
  const [showAnswerError, setShowAnswerError] = useState(false);


  const [submit, { loading, error }] =
    useMutation<SubmitResult>(SUBMIT_QUIZ_ATTEMPT);

  const toggle = (qId: string, optId: string, multiple: boolean) =>
    setChoice((prev) => {
      const cur = prev[qId] ?? [];

      if (multiple) {
        return {
          ...prev,
          [qId]: cur.includes(optId)
            ? cur.filter((x) => x !== optId)
            : [...cur, optId],
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
    // card is driven by the returned attempt (SYN-58).
    const answers = quiz.questions.map((q) => ({
      questionId: q.id,
      ...(q.type === "OPEN_QUESTION"
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
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        {quiz.title ?? "Quiz"}
        {quiz.required ? " · required" : ""}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {quiz.questions.map((q, i) => {
          const submittedAnswer = result?.answers.find((answer) => {
            return answer.questionId === q.id;
          });
          const correctOptionIds =
          submittedAnswer?.question.options.filter((option) => {
            return option.isCorrect;
          }).map((option) => {
            return option.id;
          });
            return (
              <div key={q.id}>

                {q.type === "OPEN_QUESTION" ? (
                  <>
                    <p className="mb-2 font-medium text-foreground">
                      {i + 1}. {q.prompt}
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
                      placeholder="Your answer…"
                      className="w-full rounded-lg border border-border p-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </>
                ) : q.type === "SINGLE_CHOICE" ? (
                  <QuizSingle question={q} questionNumber={i + 1} choice={choice[q.id] ?? []} onToggle={(optionId) => toggle(q.id, optionId, false)} submitted = {submitted} correctOptionIds = {correctOptionIds ?? []}/>
                ) : q.type === "MULTIPLE_CHOICE" ? (
                  <QuizMulti question={q} questionNumber={i + 1} choice={choice[q.id] ?? []} onToggle={(optionId) => toggle(q.id, optionId, true)} submitted = {submitted} correctOptionIds = {correctOptionIds ?? []}/>
                ) : (
                  <p>Unknown question type</p>
                )}
                {submitted && q.type !== "OPEN_QUESTION" && (
                  <div className={`mt-4 rounded-xl px-4 py-4 ${submittedAnswer?.isCorrect ? "bg-[hsl(var(--success)/0.1)]" : "bg-[hsl(var(--destructive)/0.1)]"}`}>
                    <strong>
                      {submittedAnswer?.isCorrect ? "Correct." : "Incorrect."}
                    </strong>
                    {" "}
                    {submittedAnswer?.question.explanation}
                  </div>
                )}
              </div>
            )
        })}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit quiz"}
          </button>

          {showAnswerError &&
            <span className= "rounded-xl px-4 py-4 bg-[hsl(var(--destructive)/0.1)]">
              Please answer all questions
            </span>
          }

          {hasIncorrectAnswer &&
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              onClick={onRetry}
            >
              Retry
            </button>
          }

          {error && (
            <span className="text-sm text-destructive">
              Could not submit.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
