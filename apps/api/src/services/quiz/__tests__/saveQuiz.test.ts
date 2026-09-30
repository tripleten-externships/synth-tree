import { validateSaveQuizInput, type SaveQuizInputShape } from "../saveQuiz";

/**
 * Validation rules for authored quizzes (SYN-72). saveQuiz runs these before it
 * writes anything, so a half-valid quiz never reaches the database: a
 * single-choice question with no correct option would fail every learner.
 */

function quiz(questions: SaveQuizInputShape["questions"]): SaveQuizInputShape {
  return { required: false, questions };
}

const singleChoice = {
  type: "SINGLE_CHOICE" as const,
  prompt: "Which one?",
  options: [
    { text: "Right", isCorrect: true },
    { text: "Wrong", isCorrect: false },
  ],
};

function expectRejection(input: SaveQuizInputShape, message: RegExp) {
  expect(() => validateSaveQuizInput(input)).toThrow(message);
  try {
    validateSaveQuizInput(input);
  } catch (error: any) {
    expect(error.extensions?.code).toBe("BAD_USER_INPUT");
  }
}

describe("validateSaveQuizInput", () => {
  it("accepts a quiz with one valid question of each type", () => {
    expect(() =>
      validateSaveQuizInput(
        quiz([
          singleChoice,
          {
            type: "MULTIPLE_CHOICE",
            prompt: "Which ones?",
            options: [
              { text: "Yes", isCorrect: true },
              { text: "Also yes", isCorrect: true },
              { text: "No", isCorrect: false },
            ],
          },
          {
            type: "FILL",
            prompt: "Type it",
            canonicalAnswer: "SP",
            options: [],
          },
          { type: "OPEN_QUESTION", prompt: "Explain", options: [] },
        ]),
      ),
    ).not.toThrow();
  });

  it("rejects a quiz with no questions", () => {
    expectRejection(quiz([]), /at least one question/i);
  });

  it("rejects a blank prompt", () => {
    expectRejection(quiz([{ ...singleChoice, prompt: "   " }]), /Question 1.*prompt/i);
  });

  it("names the question that is wrong", () => {
    expectRejection(quiz([singleChoice, { ...singleChoice, prompt: "" }]), /Question 2.*prompt/i);
  });

  it("rejects a choice question with fewer than two answers", () => {
    expectRejection(
      quiz([{ ...singleChoice, options: [{ text: "Only one", isCorrect: true }] }]),
      /Question 1.*two answers/i,
    );
  });

  it("rejects a blank answer", () => {
    expectRejection(
      quiz([
        {
          ...singleChoice,
          options: [
            { text: "Right", isCorrect: true },
            { text: "  ", isCorrect: false },
          ],
        },
      ]),
      /Question 1.*empty answer/i,
    );
  });

  it("rejects single choice with no correct answer", () => {
    expectRejection(
      quiz([
        {
          ...singleChoice,
          options: [
            { text: "Wrong", isCorrect: false },
            { text: "Also wrong", isCorrect: false },
          ],
        },
      ]),
      /Question 1.*exactly one correct answer/i,
    );
  });

  it("rejects single choice with two correct answers", () => {
    expectRejection(
      quiz([
        {
          ...singleChoice,
          options: [
            { text: "Right", isCorrect: true },
            { text: "Also right", isCorrect: true },
          ],
        },
      ]),
      /Question 1.*exactly one correct answer/i,
    );
  });

  it("rejects multiple choice with no correct answer", () => {
    expectRejection(
      quiz([
        {
          type: "MULTIPLE_CHOICE",
          prompt: "Which ones?",
          options: [
            { text: "Wrong", isCorrect: false },
            { text: "Also wrong", isCorrect: false },
          ],
        },
      ]),
      /Question 1.*at least one correct answer/i,
    );
  });

  it("rejects a FILL question without a correct answer", () => {
    expectRejection(
      quiz([{ type: "FILL", prompt: "Type it", canonicalAnswer: "  ", options: [] }]),
      /Question 1.*correct answer/i,
    );
  });

  it("rejects answers on a FILL question", () => {
    expectRejection(
      quiz([
        {
          type: "FILL",
          prompt: "Type it",
          canonicalAnswer: "SP",
          options: [{ text: "SP", isCorrect: true }],
        },
      ]),
      /Question 1.*cannot have answers/i,
    );
  });

  it("rejects answers on an open question", () => {
    expectRejection(
      quiz([
        {
          type: "OPEN_QUESTION",
          prompt: "Explain",
          options: [{ text: "Something", isCorrect: true }],
        },
      ]),
      /Question 1.*cannot have answers/i,
    );
  });

  it("rejects a correct answer key on a question that is not FILL", () => {
    expectRejection(
      quiz([{ ...singleChoice, canonicalAnswer: "SP" }]),
      /Question 1.*fill in the blank/i,
    );
  });
});
