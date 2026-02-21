import { app } from "../../../../index"; // adjust path based on test location
import request from "supertest";
import { gradeQuizAttempt } from "../gradeQuizAttempt";
// Mock Prisma transaction client
const mockTx = {
  quiz: {
    findUnique: jest.fn(),
  },
  quizAttemptAnswer: {
    update: jest.fn(),
  },
  quizAttempt: {
    update: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe("gradeQuizAttempt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTx.quiz.findUnique.mockResolvedValue(undefined);
    mockTx.quizAttempt.findUnique.mockResolvedValue(undefined);
  });
  // SINGLE_CHOICE question graded correctly
  it("grades a SINGLE_CHOICE question correctly", async () => {
    const mockQuiz = {
      questions: [
        {
          type: "SINGLE_CHOICE",
          options: [
            { id: "opt1", isCorrect: true },
            { id: "opt2", isCorrect: false },
          ],
        },
      ],
    };
    const mockAttempt = {
      quizId: "quiz1",
      answers: [
        {
          id: "answer1",
          question: mockQuiz.questions[0],
          answer: { selectedOptionIds: ["opt1"] },
        },
      ],
    };
    mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

    const result = await gradeQuizAttempt(mockTx as any, "attempt1");
    expect(result.correctCount).toBe(1);
    expect(result.passed).toBe(true);
    expect(result.message).toBe("Passed");
  });
  // MULTIPLE_CHOICE question graded correctly
  it("grades a MULTIPLE_CHOICE question correctly", async () => {
    const mockQuiz = {
      questions: [
        {
          type: "MULTIPLE_CHOICE",
          options: [
            { id: "opt1", isCorrect: true },
            { id: "opt2", isCorrect: true },
            { id: "opt3", isCorrect: false },
          ],
        },
      ],
    };
    const mockAttempt = {
      quizId: "quiz2",
      answers: [
        {
          id: "answer2",
          question: mockQuiz.questions[0],
          answer: { selectedOptionIds: ["opt1", "opt2"] },
        },
      ],
    };
    mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

    const result = await gradeQuizAttempt(mockTx as any, "attempt2");
    expect(result.correctCount).toBe(1);
    expect(result.passed).toBe(true);
    expect(result.message).toBe("Passed");
  });
  // OPEN_QUESTION triggers manual review
  it("handles OPEN_QUESTION as manual review", async () => {
    const mockQuiz = {
      questions: [
        {
          type: "OPEN_QUESTION",
          options: [],
        },
      ],
    };
    const mockAttempt = {
      quizId: "quiz3",
      answers: [
        {
          id: "answer3",
          question: mockQuiz.questions[0],
          answer: { text: "My answer" },
        },
      ],
    };
    mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

    const result = await gradeQuizAttempt(mockTx as any, "attempt3");
    expect(result.correctCount).toBe(0);
    expect(result.passed).toBe(null); // Expect null for manual review
    expect(result.message).toBe(
      "Passed pending manual review of open question(s)",
    );
  });
  // MULTIPLE_CHOICE partially correct (includes incorrect option)
  it("fails when MULTIPLE_CHOICE answer is partially correct", async () => {
    const mockQuiz = {
      questions: [
        {
          type: "MULTIPLE_CHOICE",
          options: [
            { id: "opt1", isCorrect: true },
            { id: "opt2", isCorrect: true },
            { id: "opt3", isCorrect: false },
          ],
        },
      ],
    };
    const mockAttempt = {
      quizId: "quiz4",
      answers: [
        {
          id: "answer4",
          question: mockQuiz.questions[0],
          answer: { selectedOptionIds: ["opt1", "opt3"] }, // includes incorrect option
        },
      ],
    };
    mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

    const result = await gradeQuizAttempt(mockTx as any, "attempt4");
    expect(result.correctCount).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.message).toBe("Not passed");
  });
  // Quiz with all OPEN_QUESTIONs
  it("handles quiz with all open questions", async () => {
    const mockQuiz = {
      questions: [
        { type: "OPEN_QUESTION", options: [] },
        { type: "OPEN_QUESTION", options: [] },
      ],
    };
    const mockAttempt = {
      quizId: "quiz6",
      answers: [
        {
          id: "answer6a",
          question: mockQuiz.questions[0],
          answer: { text: "Answer 1" },
        },
        {
          id: "answer6b",
          question: mockQuiz.questions[1],
          answer: { text: "Answer 2" },
        },
      ],
    };
    mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

    const result = await gradeQuizAttempt(mockTx as any, "attempt6");
    expect(result.correctCount).toBe(0);
    expect(result.passed).toBe(null);
    expect(result.message).toBe(
      "Passed pending manual review of open question(s)",
    );
  });
  // Quiz with all three types of questions - all auto-gradable correct
  it("handles a quiz with SINGLE_CHOICE, MULTIPLE_CHOICE, and OPEN_QUESTION", async () => {
    const mockQuiz = {
      questions: [
        {
          type: "SINGLE_CHOICE",
          options: [
            { id: "opt1", isCorrect: true },
            { id: "opt2", isCorrect: false },
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          options: [
            { id: "opt3", isCorrect: true },
            { id: "opt4", isCorrect: true },
            { id: "opt5", isCorrect: false },
          ],
        },
        {
          type: "OPEN_QUESTION",
          options: [],
        },
      ],
    };
    const mockAttempt = {
      quizId: "quiz7",
      answers: [
        {
          id: "answer7a",
          question: mockQuiz.questions[0],
          answer: { selectedOptionIds: ["opt1"] }, // correct SINGLE_CHOICE
        },
        {
          id: "answer7b",
          question: mockQuiz.questions[1],
          answer: { selectedOptionIds: ["opt3", "opt4"] }, // correct MULTIPLE_CHOICE
        },
        {
          id: "answer7c",
          question: mockQuiz.questions[2],
          answer: { text: "Open answer" }, // OPEN_QUESTION
          isCorrect: null,
        },
      ],
    };
    mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

    const result = await gradeQuizAttempt(mockTx as any, "attempt7");
    expect(result.correctCount).toBe(2); // Only auto-gradable questions
    expect(result.passed).toBe(null); // Pending manual review
    expect(result.message).toBe(
      "Passed pending manual review of open question(s)",
    );
  });
});

// Quiz with all three types of questions - one auto-gradable incorrect
it("handles a quiz with all types and an incorrect auto-gradable answer", async () => {
  const mockQuiz = {
    questions: [
      {
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt1", isCorrect: true },
          { id: "opt2", isCorrect: false },
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        options: [
          { id: "opt3", isCorrect: true },
          { id: "opt4", isCorrect: true },
          { id: "opt5", isCorrect: false },
        ],
      },
      {
        type: "OPEN_QUESTION",
        options: [],
      },
    ],
  };
  const mockAttempt = {
    quizId: "quiz8",
    answers: [
      {
        id: "answer8a",
        question: mockQuiz.questions[0],
        answer: { selectedOptionIds: ["opt2"] }, // incorrect SINGLE_CHOICE
      },
      {
        id: "answer8b",
        question: mockQuiz.questions[1],
        answer: { selectedOptionIds: ["opt3", "opt4"] }, // correct MULTIPLE_CHOICE
      },
      {
        id: "answer8c",
        question: mockQuiz.questions[2],
        answer: { text: "Open answer" }, // OPEN_QUESTION
        isCorrect: null,
      },
    ],
  };
  mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
  mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

  const result = await gradeQuizAttempt(mockTx as any, "attempt8");
  expect(result.correctCount).toBe(1); // Only one auto-gradable correct
  expect(result.passed).toBe(false); // Still pending manual review
  expect(result.message).toBe(
    "Not passed: some answers are incorrect; open question(s) pending review",
  );
});
// Quiz with a skipped question (not all auto-gradable answered)
it("handles a quiz where a question is skipped (no answer submitted)", async () => {
  const mockQuiz = {
    questions: [
      {
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt1", isCorrect: true },
          { id: "opt2", isCorrect: false },
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        options: [
          { id: "opt3", isCorrect: true },
          { id: "opt4", isCorrect: true },
          { id: "opt5", isCorrect: false },
        ],
      },
    ],
  };
  const mockAttempt = {
    quizId: "quiz9",
    answers: [
      {
        id: "answer9a",
        question: mockQuiz.questions[0],
        answer: { selectedOptionIds: ["opt1"] }, // correct SINGLE_CHOICE
      },
      // MULTIPLE_CHOICE question is skipped (no answer)
    ],
  };
  mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
  mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

  const result = await gradeQuizAttempt(mockTx as any, "attempt9");
  expect(result.correctCount).toBe(1);
  expect(result.passed).toBe(false); // Not all auto-gradable questions answered
  expect(result.message).toBe("Not passed");
});
// No answers submitted
it("throws an error if no answers are found for the attempt", async () => {
  const mockQuiz = {
    questions: [
      { type: "SINGLE_CHOICE", options: [{ id: "opt1", isCorrect: true }] },
    ],
  };
  const mockAttempt = {
    quizId: "quizNoAnswers",
    answers: [],
  };
  mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
  mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

  await expect(
    gradeQuizAttempt(mockTx as any, "attemptNoAnswers"),
  ).rejects.toThrow("No answers found for this attempt");
});
// Empty quiz
it("throws an error if the quiz has no questions", async () => {
  const mockQuiz = { questions: [] };
  const mockAttempt = {
    quizId: "quizEmpty",
    answers: [],
  };
  mockTx.quiz.findUnique.mockResolvedValue(mockQuiz);
  mockTx.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

  await expect(gradeQuizAttempt(mockTx as any, "attemptEmpty")).rejects.toThrow(
    "Quiz has no questions",
  );
});
// Quiz attempt not found
it("throws an error if the quiz attempt is not found", async () => {
  mockTx.quizAttempt.findUnique.mockResolvedValue(undefined);
  await expect(gradeQuizAttempt(mockTx as any, "attemptEmpty")).rejects.toThrow(
    "Quiz attempt not found",
  );
});
