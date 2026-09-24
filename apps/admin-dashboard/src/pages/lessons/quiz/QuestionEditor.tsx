import { Button, Input } from "@synth-tree/ui";
import { Trash } from "lucide-react";

import { newOption, QUESTION_TYPE_LABELS, type OptionDraft, type QuestionDraft } from "./quizDraft";

// A choice question needs at least two answers to be saveable, so the delete
// control is disabled rather than letting the author reach an invalid quiz.
const MIN_CHOICE_OPTIONS = 2;

type QuestionEditorProps = {
  question: QuestionDraft;
  index: number;
  onChange: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
};

export function QuestionEditor({ question, index, onChange, onRemove }: QuestionEditorProps) {
  const position = index + 1;
  const isChoice = question.type === "SINGLE_CHOICE" || question.type === "MULTIPLE_CHOICE";
  const isSingleChoice = question.type === "SINGLE_CHOICE";

  const updateOptions = (options: OptionDraft[]) => onChange({ options });

  const handleCorrectChange = (optionId: string) => {
    if (isSingleChoice) {
      // Exactly one correct answer, so picking one clears the others.
      updateOptions(
        question.options.map((option) => ({
          ...option,
          isCorrect: option.id === optionId,
        })),
      );
      return;
    }

    updateOptions(
      question.options.map((option) =>
        option.id === optionId ? { ...option, isCorrect: !option.isCorrect } : option,
      ),
    );
  };

  return (
    <div className="rounded-[14px] border border-border p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="mb-1 text-xs text-muted-foreground">
            Question {position} · {QUESTION_TYPE_LABELS[question.type]}
          </p>
          <Input
            value={question.prompt}
            onChange={(e) => onChange({ prompt: e.target.value })}
            aria-label={`Question ${position} prompt`}
          />
        </div>
        <Button
          onClick={onRemove}
          variant="outline"
          size="sm"
          className="rounded-xl border-0 text-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Delete question ${position}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {isChoice && (
        <div className="flex flex-col gap-2">
          {question.options.map((option, optionIndex) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type={isSingleChoice ? "radio" : "checkbox"}
                name={`question-${question.id}-correct`}
                checked={option.isCorrect}
                onChange={() => handleCorrectChange(option.id)}
                aria-label={`Answer ${optionIndex + 1} of question ${position} is correct`}
              />
              <Input
                value={option.text}
                onChange={(e) =>
                  updateOptions(
                    question.options.map((current) =>
                      current.id === option.id ? { ...current, text: e.target.value } : current,
                    ),
                  )
                }
                className="flex-1"
                aria-label={`Answer ${optionIndex + 1} of question ${position}`}
              />
              <Button
                onClick={() =>
                  updateOptions(question.options.filter((current) => current.id !== option.id))
                }
                variant="outline"
                size="sm"
                disabled={question.options.length <= MIN_CHOICE_OPTIONS}
                title={
                  question.options.length <= MIN_CHOICE_OPTIONS
                    ? "A question needs at least two answers"
                    : undefined
                }
                className="rounded-xl border-0 text-foreground hover:bg-muted hover:text-foreground"
                aria-label={`Delete answer ${optionIndex + 1} of question ${position}`}
              >
                <Trash className="h-[13px] w-[13px]" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => updateOptions([...question.options, newOption("New answer")])}
            variant="outline"
            size="sm"
            className="mt-1 self-start rounded-xl border-0 text-foreground hover:bg-muted hover:text-foreground"
          >
            + Add answer
          </Button>
        </div>
      )}

      {question.type === "FILL" && (
        <div>
          <Input
            value={question.canonicalAnswer}
            onChange={(e) => onChange({ canonicalAnswer: e.target.value })}
            placeholder="Correct answer"
            aria-label={`Correct answer for question ${position}`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Capital letters and extra spaces are ignored when this is graded.
          </p>
        </div>
      )}

      {question.type === "OPEN_QUESTION" && (
        <p className="text-xs text-muted-foreground">
          Written answers are saved for review. They are not graded automatically, so a quiz with
          one waits for a person to mark it.
        </p>
      )}

      <div className="mt-3">
        <label
          className="mb-1 block text-xs text-muted-foreground"
          htmlFor={`explanation-${question.id}`}
        >
          Explanation (shown after answering)
        </label>
        <textarea
          id={`explanation-${question.id}`}
          value={question.explanation}
          onChange={(e) => onChange({ explanation: e.target.value })}
          rows={2}
          placeholder="Explain why the correct answer is correct…"
          className="w-full rounded-md border border-border bg-transparent p-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  );
}

export default QuestionEditor;
