import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_QUIZ_ATTEMPT } from "../graphql/mutations/submitQuizAttempt";

type QuizOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

type QuizQuestion = {
  id: string;
  prompt: string;
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

  if (result) {
    const incorrectAnswers = result.answers.filter(
      (answer) => answer.isCorrect === false,
    );
    const isPendingReview = result.passed === null;

    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div
          className={`mb-6 rounded-2xl p-5 ${
            isPendingReview ? "bg-amber-50" : result.passed ? "bg-emerald-50" : "bg-red-50"
          }`}
        >
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${
              isPendingReview
                ? "text-amber-700"
                : result.passed
                  ? "text-emerald-700"
                  : "text-red-700"
            }`}
          >
            Quiz submitted
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {isPendingReview
              ? "Waiting for review"
              : result.passed
                ? "You passed!"
                : "Keep practicing"}
          </h2>

          {isPendingReview ? (
            <p className="mt-2 text-sm text-amber-800">
              Your written answer was submitted and is waiting for manual review.
            </p>
          ) : result.passed ? (
            <p className="mt-2 text-sm text-emerald-800">
              You have completed this quiz.
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-700">
              Review the questions below, then retry when you are ready.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {result.answers.map((answer, index) => {
            const selectedOptionIds =
              answer.answer?.selectedOptionIds ?? [];

            const selectedOptions = answer.question.options.filter((option) =>
              selectedOptionIds.includes(option.id),
            );

            const correctOptions = answer.question.options.filter(
              (option) => option.isCorrect,
            );

            const isIncorrect = answer.isCorrect === false;
            const isNotGraded =
              answer.isCorrect === null ||
              answer.isCorrect === undefined;

            return (
              <div
                key={answer.id}
                className={`rounded-2xl border p-4 ${
                  isIncorrect
                    ? "border-red-200 bg-red-50"
                    : isNotGraded
                      ? "border-gray-200 bg-gray-50"
                      : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-medium text-gray-900">
                    {index + 1}. {answer.question.prompt}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isIncorrect
                        ? "bg-red-100 text-red-700"
                        : isNotGraded
                          ? "bg-gray-200 text-gray-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isIncorrect
                      ? "Incorrect"
                      : isNotGraded
                        ? "Not graded"
                        : "Correct"}
                  </span>
                </div>

                {answer.question.type === "OPEN_QUESTION" ? (
                  <p className="text-sm text-gray-700">
                    Your answer:{" "}
                    {answer.answer?.text || "No answer provided"}
                  </p>
                ) : (
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      Your answer:{" "}
                      {selectedOptions.length > 0
                        ? selectedOptions
                            .map((option) => option.text)
                            .join(", ")
                        : "No answer selected"}
                    </p>

                    {isIncorrect && (
                      <p>
                        Correct answer:{" "}
                        {correctOptions.length > 0
                          ? correctOptions
                              .map((option) => option.text)
                              .join(", ")
                          : "Not available"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!result.passed && incorrectAnswers.length > 0 && (
          <p className="mt-4 text-sm text-gray-600">
            {incorrectAnswers.length} question
            {incorrectAnswers.length === 1 ? " was" : "s were"} incorrect.
          </p>
        )}

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        {quiz.title ?? "Quiz"}
        {quiz.required ? " · required" : ""}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {quiz.questions.map((q, i) => (
          <div key={q.id}>
            <p className="mb-2 font-medium text-gray-800">
              {i + 1}. {q.prompt}
            </p>

            {q.type === "OPEN_QUESTION" ? (
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
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <div className="flex flex-col gap-2">
                {q.options.map((o) => {
                  const multiple = q.type === "MULTIPLE_CHOICE";

                  return (
                    <label
                      key={o.id}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type={multiple ? "checkbox" : "radio"}
                        name={q.id}
                        checked={(choice[q.id] ?? []).includes(o.id)}
                        onChange={() =>
                          toggle(q.id, o.id, multiple)
                        }
                      />

                      {o.text}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit quiz"}
          </button>

          {error && (
            <span className="text-sm text-red-600">
              Could not submit.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
