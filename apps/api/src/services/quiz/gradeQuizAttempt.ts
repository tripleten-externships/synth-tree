import type { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  OPEN_QUESTION = "OPEN_QUESTION",
}

type SelectedAnswer = { selectedOptionIds: string[] };
type OpenAnswer = { text: string };
type AnswerJson = SelectedAnswer | OpenAnswer;

// Type guard for SelectedAnswer
function isSelectedAnswer(answer: any): answer is SelectedAnswer {
  return (
    answer &&
    typeof answer === "object" &&
    !Array.isArray(answer) &&
    "selectedOptionIds" in answer &&
    Array.isArray((answer as any).selectedOptionIds)
  );
}

export interface GradingSummary {
  correctCount: number;
  totalQuestions: number;
  passed: boolean | null;
  message: string;
}

/**
 * Grades a quiz attempt, updates the database, and returns a grading summary.
 * Handles single choice, multiple choice, and open questions.
 * Throws errors for missing data or invalid attempts.
 */
export async function gradeQuizAttempt(
  tx: Prisma.TransactionClient,
  attemptId: string,
): Promise<GradingSummary> {
  const attempt = await tx.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: {
        include: {
          question: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    throw new GraphQLError("Quiz attempt not found");
  }

  const quiz = await tx.quiz.findUnique({
    where: { id: attempt.quizId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new GraphQLError("Quiz not found");
  }

  if (quiz.questions.length === 0) {
    throw new GraphQLError("Quiz has no questions");
  }

  if (!attempt.answers.length) {
    throw new GraphQLError("No answers found for this attempt");
  }

  let correctCount = 0;
  let totalQuestions = 0;
  let allAutoGradableCorrect = true;

  for (const answer of attempt.answers) {
    const { question, answer: answerJson } = answer;

    totalQuestions++;

    if (question.type === QuestionType.OPEN_QUESTION) {
      await tx.quizAttemptAnswer.update({
        where: { id: answer.id },
        data: { isCorrect: null },
      });

      continue;
    }

    let selectedOptionIds: string[] = [];

    if (isSelectedAnswer(answerJson)) {
      selectedOptionIds = answerJson.selectedOptionIds;
    }

    const correctOptionIds = question.options.filter((o) => o.isCorrect).map((o) => o.id);

    let isCorrect = false;

    if (question.type === QuestionType.SINGLE_CHOICE) {
      isCorrect = selectedOptionIds.length === 1 && correctOptionIds.includes(selectedOptionIds[0]);
    } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
      const uniqueSelectedOptionIds = [...new Set(selectedOptionIds)];

      isCorrect =
        uniqueSelectedOptionIds.length === correctOptionIds.length &&
        uniqueSelectedOptionIds.every((id) => correctOptionIds.includes(id));
    }

    await tx.quizAttemptAnswer.update({
      where: { id: answer.id },
      data: { isCorrect },
    });

    if (isCorrect) {
      correctCount++;
    } else {
      allAutoGradableCorrect = false;
    }
  }

  const totalAutoGradableQuestions = quiz.questions.filter(
    (q) => q.type !== QuestionType.OPEN_QUESTION,
  ).length;

  const autoGradableAnswers = attempt.answers.filter(
    (a) => a.question.type !== QuestionType.OPEN_QUESTION,
  ).length;

  const allAnswered = autoGradableAnswers === totalAutoGradableQuestions;

  const totalOpenQuestions = quiz.questions.filter(
    (q) => q.type === QuestionType.OPEN_QUESTION,
  ).length;

  const openAnswers = attempt.answers.filter(
    (a) => a.question.type === QuestionType.OPEN_QUESTION,
  ).length;

  const hasOpenQuestion = totalOpenQuestions > 0;
  const allOpenQuestionsAnswered = openAnswers === totalOpenQuestions;

  let passed: boolean | null;
  let message: string;

  if (totalAutoGradableQuestions === 0) {
    passed = true;
    message = "Passed";
  } else if (hasOpenQuestion) {
    if (!allOpenQuestionsAnswered) {
      passed = false;
      message = "Not passed: all questions must be answered";
    } else if (allAnswered && allAutoGradableCorrect) {
      passed = null;
      message = "Passed pending manual review of open question(s)";
    } else {
      passed = false;
      message = "Not passed: some answers are incorrect; open question(s) pending review";
    }
  } else {
    passed = allAnswered && allAutoGradableCorrect;
    message = passed ? "Passed" : "Not passed";
  }

  await tx.quizAttempt.update({
    where: { id: attemptId },
    data: { passed },
  });

  return {
    correctCount,
    totalQuestions,
    passed,
    message,
  };
}
