import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_QUIZ_ATTEMPT } from "../graphql/mutations/submitQuizAttempt";

type QuizOption = { id: string; text: string };
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

type SubmitResult = { submitQuizAttempt: { id: string; passed: boolean } };

export default function QuizRunner({ quiz }: { quiz: QuizForRunner }) {
  const [choice, setChoice] = useState<Record<string, string[]>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [passed, setPassed] = useState<boolean | undefined>(undefined);

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
      return { ...prev, [qId]: [optId] };
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const answers = quiz.questions.map((q) =>
      JSON.stringify({
        questionId: q.id,
        answer:
          q.type === "OPEN_QUESTION"
            ? { text: text[q.id] ?? "" }
            : { selectedOptionIds: choice[q.id] ?? [] },
      }),
    );
    const res = await submit({ variables: { quizId: quiz.id, answers } });
    setPassed(res.data?.submitQuizAttempt.passed ?? false);
  };

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
                onChange={(e) => setText((p) => ({ ...p, [q.id]: e.target.value }))}
                rows={3}
                placeholder="Your answer…"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <div className="flex flex-col gap-2">
                {q.options.map((o) => {
                  const multiple = q.type === "MULTIPLE_CHOICE";
                  return (
                    <label key={o.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type={multiple ? "checkbox" : "radio"}
                        name={q.id}
                        checked={(choice[q.id] ?? []).includes(o.id)}
                        onChange={() => toggle(q.id, o.id, multiple)}
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
          {passed !== undefined && (
            <span className={`text-sm font-medium ${passed ? "text-green-600" : "text-gray-600"}`}>
              {passed ? "✓ Passed!" : "Submitted — not passed yet"}
            </span>
          )}
          {error && <span className="text-sm text-red-600">Could not submit.</span>}
        </div>
      </form>
    </section>
  );
}
