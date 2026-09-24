import type { QuizQuestion } from "./QuizRunner";
import { Check } from "lucide-react";

function QuizMulti({
  question,
  questionNumber,
  choice,
  onToggle,
  submitted,
  correctOptionIds,
}: {
  question: QuizQuestion;
  questionNumber: number;
  choice: string[];
  onToggle: (optionId: string) => void;
  submitted: boolean;
  correctOptionIds: string[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-lg font-semibold text-muted-foreground">
          Question {questionNumber}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          Multiple choice
        </span>
      </div>
      <p className="mb-6 text-xl font-medium text-foreground">{question.prompt}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const isCorrect = correctOptionIds.includes(option.id);
          const isSelected = choice.includes(option.id);
          return (
            <label
              key={option.id}
              className={`group flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 px-7 py-5 text-base text-foreground transition-colors ${
                submitted && isCorrect
                  ? "border-[hsl(var(--success)/0.55)] bg-[hsl(var(--success)/0.1)]"
                  : submitted && isSelected
                    ? "border-[hsl(var(--destructive)/0.55)] bg-[hsl(var(--destructive)/0.1)]"
                    : isSelected
                      ? "border-primary bg-accent"
                      : "border-border bg-background hover:border-[hsl(var(--primary)/0.5)]"
              }`}
            >
              <input
                type="checkbox"
                name={question.id}
                checked={isSelected}
                onChange={() => onToggle(option.id)}
                disabled={submitted}
                className="sr-only"
              />
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-colors ${
                  submitted && isCorrect
                    ? "bg-success text-success-foreground"
                    : submitted && isSelected
                      ? "bg-destructive text-destructive-foreground"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground group-hover:bg-accent group-hover:text-accent-foreground"
                }`}
              >
                {isSelected && <Check aria-hidden="true" className="h-5 w-5" />}
              </span>
              {option.text}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default QuizMulti;
