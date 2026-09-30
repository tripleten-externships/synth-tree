import type { AdminLessonQuizQuery, QuestionType, SaveQuizInput } from "@synth-tree/api-types";

/**
 * Local draft state for the quiz section of the lesson editor (SYN-72).
 *
 * The editor keeps the quiz in React state and writes it on Save, the same way
 * lesson blocks work. Rows that already exist keep their real id so the API can
 * update them in place; new ones get a `temp-` id, which is stripped on the way
 * out. Reusing ids matters because deleting a question also deletes the answers
 * learners already gave.
 */

export type OptionDraft = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuestionDraft = {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  canonicalAnswer: string;
  options: OptionDraft[];
};

export type QuizDraft = {
  id: string | null;
  required: boolean;
  questions: QuestionDraft[];
};

type ServerQuiz = NonNullable<NonNullable<AdminLessonQuizQuery["adminSkillNode"]>["quiz"]>;

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SINGLE_CHOICE: "Single choice",
  MULTIPLE_CHOICE: "Multiple choice",
  FILL: "Fill in blank",
  OPEN_QUESTION: "Open question",
};

function tempId(): string {
  return `temp-${crypto.randomUUID()}`;
}

export function isTempId(id: string): boolean {
  return id.startsWith("temp-");
}

export function newOption(text: string, isCorrect = false): OptionDraft {
  return { id: tempId(), text, isCorrect };
}

/**
 * A fresh question, with the starting answers from the design mock. Single and
 * multiple choice open with the first answer marked correct so the draft is
 * valid the moment it is added.
 */
export function newQuestion(type: QuestionType): QuestionDraft {
  const needsOptions = type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE";

  return {
    id: tempId(),
    type,
    prompt: "New question",
    explanation: "",
    canonicalAnswer: "",
    options: needsOptions
      ? [newOption("Answer 1", true), newOption("Answer 2"), newOption("Answer 3")]
      : [],
  };
}

// The starting point for "Add a quiz": one single-choice question, per the mock.
export function newQuizDraft(): QuizDraft {
  return {
    id: null,
    required: false,
    questions: [
      {
        ...newQuestion("SINGLE_CHOICE"),
        options: [newOption("Answer 1", true), newOption("Answer 2")],
      },
    ],
  };
}

export function quizDraftFromServer(quiz: ServerQuiz): QuizDraft {
  return {
    id: quiz.id,
    required: quiz.required,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      explanation: question.explanation ?? "",
      canonicalAnswer: question.canonicalAnswer ?? "",
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        // isCorrect is null for anyone who may not see the answer key; the
        // editor is admin-only, so that only happens if the guard changes.
        isCorrect: option.isCorrect ?? false,
      })),
    })),
  };
}

export function toSaveQuizInput(draft: QuizDraft): SaveQuizInput {
  return {
    required: draft.required,
    questions: draft.questions.map((question) => ({
      ...(isTempId(question.id) ? {} : { id: question.id }),
      type: question.type,
      prompt: question.prompt,
      explanation: question.explanation.trim() === "" ? null : question.explanation,
      // The API only accepts an answer key on fill-in-the-blank questions.
      canonicalAnswer: question.type === "FILL" ? question.canonicalAnswer : null,
      options: question.options.map((option) => ({
        ...(isTempId(option.id) ? {} : { id: option.id }),
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    })),
  };
}
