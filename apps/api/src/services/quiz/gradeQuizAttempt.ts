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
 * Grades a quiz attempt, updates the database, and returns a grading summary
 * Handles single choice, multiple choice, and open questions
 * Throws errors for missing data or invalid attempts
 */
export async function gradeQuizAttempt(
  tx: Prisma.TransactionClient,
  attemptId: string,
): Promise<GradingSummary> {
  // Fetch quiz attempt and related data (model QuizAttemptAnswer)
  const attempt = await tx.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: {
        include: {
          // For each answer, fetch the related QuizQuestion (model QuizQuestion)
          question: { include: { options: true } }, // QuizOption
        },
      },
    },
  });

  // - If quiz attempt is not found
  if (!attempt) throw new GraphQLError("Quiz attempt not found");

  // Fetch quiz for this attempt
  const quiz = await tx.quiz.findUnique({
    where: { id: attempt.quizId },
    include: { questions: { include: { options: true } } },
  });

  // - If quiz is not found
  if (!quiz) throw new GraphQLError("Quiz not found");
  // - If there are no questions at all, throw an error
  if (quiz.questions.length === 0) {
    throw new GraphQLError("Quiz has no questions");
  }
  // - If no answers are found for the attempt
  if (!attempt.answers.length)
    throw new GraphQLError("No answers found for this attempt");

  let correctCount = 0;
  let totalQuestions = 0;
  let allAutoGradableCorrect = true;

  // Grade each answer
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
    // Safely extract selectedOptionIds if answerJson is an object and has this property
    let selectedOptionIds: string[] = [];
    if (isSelectedAnswer(answerJson)) {
      selectedOptionIds = answerJson.selectedOptionIds;
    }

    // Get the IDs of the correct options for this question (from QuizQuestion.options)
    const correctOptionIds = question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);
    // Default value; will set to true if grading logic passes
    let isCorrect = false;
    // SINGLE CHOICE:  correct if exactly one correct option is selected
    if (question.type === QuestionType.SINGLE_CHOICE) {
      isCorrect =
        selectedOptionIds.length === 1 &&
        correctOptionIds.includes(selectedOptionIds[0]);

      // MULTIPLE_CHOICE: Correct if all and only correct options are selected
    } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
      isCorrect =
        selectedOptionIds.length === correctOptionIds.length &&
        selectedOptionIds.every((id) => correctOptionIds.includes(id));
    }
    // Update the answer's isCorrect field in the database
    await tx.quizAttemptAnswer.update({
      where: { id: answer.id },
      data: { isCorrect },
    });

    if (isCorrect) {
      correctCount++; // Track number of correct answers
    } else {
      allAutoGradableCorrect = false; // If any answer is wrong, attempt is not passed
    }
  }

  // Count total auto-gradable (non-open) questions in quiz
  const totalAutoGradableQuestions = quiz.questions.filter(
    (q) => q.type !== QuestionType.OPEN_QUESTION,
  ).length;

  // Count the number of auto-gradable answers submitted
  const autoGradableAnswers = attempt.answers.filter(
    (a) => a.question.type !== QuestionType.OPEN_QUESTION,
  ).length;

  // Check if all auto-gradable questions were answered
  const allAnswered = autoGradableAnswers === totalAutoGradableQuestions;

  // Check if any open questions are present and ungraded (isCorrect === null)
  const hasUngradedOpen = attempt.answers.some(
    (a) =>
      a.question.type === QuestionType.OPEN_QUESTION && a.isCorrect === null,
  );

  let passed: boolean | null;
  let message: string;

  // Decide pass status and message
  // - If any open-ended questions are present and not yet graded, mark as pending manual review (passed = null).
  // - If there are no auto-gradable questions (only open questions), mark as pending manual review (passed = null)
  // - Otherwise, pass only if all auto-gradable questions are answered and correct.
  if (hasUngradedOpen || totalAutoGradableQuestions === 0) {
    if (allAnswered && allAutoGradableCorrect) {
      passed = null;
      message = "Passed pending manual review of open question(s)";
    } else {
      passed = false;
      message =
        "Not passed: some answers are incorrect; open question(s) pending review";
    }
  } else {
    passed = allAnswered && allAutoGradableCorrect;
    message = passed ? "Passed" : "Not passed";
  }
  // Update the QuizAttempt's passed field in the database
  await tx.quizAttempt.update({
    where: { id: attemptId },
    data: { passed: passed ?? false }, // Use false if passed is null
  });

  // Return grading summary
  return {
    correctCount,
    totalQuestions,
    passed,
    message,
  };
}
