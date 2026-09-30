import type { QuestionType } from "@synth-tree/api-types";
import { Button } from "@synth-tree/ui";
import { Trash } from "lucide-react";

import { QuestionEditor } from "./QuestionEditor";
import { newQuestion, newQuizDraft, type QuestionDraft, type QuizDraft } from "./quizDraft";

// v1 authors the question types the learner app can render and grade. Order and
// Match pairs are in the design but have no question type behind them yet, so
// they are shown visibly disabled rather than looking functional, the same way
// the lesson block menu handles its unbuilt types.
const ADDABLE_TYPES: { type: QuestionType; label: string }[] = [
  { type: "SINGLE_CHOICE", label: "Single choice" },
  { type: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { type: "FILL", label: "Fill in blank" },
  { type: "OPEN_QUESTION", label: "Open question" },
];

const COMING_SOON_TYPES = ["Order", "Match pairs"];

const comingSoonClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-transparent bg-transparent px-3 py-[7px] text-[13px] font-medium leading-none text-muted-foreground opacity-50";

type QuizEditorProps = {
  draft: QuizDraft | null;
  onChange: (draft: QuizDraft) => void;
  onRemove: () => void;
};

export function QuizEditor({ draft, onChange, onRemove }: QuizEditorProps) {
  if (!draft) {
    return (
      <div className="mt-8 flex justify-center border-t border-border pt-8">
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl"
          onClick={() => onChange(newQuizDraft())}
        >
          + Add a quiz
        </Button>
      </div>
    );
  }

  const updateQuestion = (questionId: string, patch: Partial<QuestionDraft>) =>
    onChange({
      ...draft,
      questions: draft.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    });

  return (
    <section className="mt-8 border-t border-border pt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">Quiz</h2>
        <Button
          onClick={onRemove}
          variant="outline"
          size="sm"
          className="rounded-xl border-0 text-foreground hover:bg-muted hover:text-foreground"
          leftIcon={<Trash className="h-[14px] w-[14px]" />}
        >
          Remove quiz
        </Button>
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={draft.required}
          onChange={(e) => onChange({ ...draft, required: e.target.checked })}
        />
        Learners must pass this quiz to complete the lesson
      </label>

      <div className="flex flex-col gap-6">
        {draft.questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            onChange={(patch) => updateQuestion(question.id, patch)}
            onRemove={() =>
              onChange({
                ...draft,
                questions: draft.questions.filter((current) => current.id !== question.id),
              })
            }
          />
        ))}
      </div>

      {draft.questions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          This quiz has no questions yet. Add one below, or remove the quiz.
        </p>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs text-muted-foreground">Add question</p>
        <div className="flex flex-wrap gap-2">
          {ADDABLE_TYPES.map(({ type, label }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() =>
                onChange({ ...draft, questions: [...draft.questions, newQuestion(type)] })
              }
            >
              + {label}
            </Button>
          ))}
          {COMING_SOON_TYPES.map((label) => (
            <Button
              key={label}
              disabled
              title="Coming soon"
              className={comingSoonClass}
              aria-label={`Add ${label.toLowerCase()} question (coming soon)`}
            >
              + {label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuizEditor;
