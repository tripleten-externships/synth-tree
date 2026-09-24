import type { Prisma, QuestionType } from "@prisma/client";
import { GraphQLError } from "graphql";

/**
 * Saves a whole authored quiz for one node in a single transaction (SYN-72).
 *
 * The admin lesson editor holds the quiz as a draft and sends all of it on
 * save. Questions and options are matched by id, so editing keeps the existing
 * rows: deleting a question cascades to the answers learners already gave
 * (QuizAttemptAnswer), so a replace-everything save would throw away their
 * history. Everything is validated first, because a partly-written quiz (a
 * single-choice question with no correct option, say) would fail every learner.
 */

const badInput = (message: string) =>
  new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT" } });

export type SaveQuizOptionShape = {
  id?: string | null;
  text: string;
  isCorrect: boolean;
};

export type SaveQuizQuestionShape = {
  id?: string | null;
  type: QuestionType;
  prompt: string;
  explanation?: string | null;
  canonicalAnswer?: string | null;
  options: SaveQuizOptionShape[];
};

export type SaveQuizInputShape = {
  required: boolean;
  questions: SaveQuizQuestionShape[];
};

function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim() === "";
}

/**
 * Throws on the first problem it finds, naming the question by its position so
 * the editor can show the author which one to fix.
 */
export function validateSaveQuizInput(input: SaveQuizInputShape): void {
  if (input.questions.length === 0) {
    throw badInput("A quiz needs at least one question, or remove the quiz.");
  }

  input.questions.forEach((question, index) => {
    const label = `Question ${index + 1}`;

    if (isBlank(question.prompt)) {
      throw badInput(`${label} needs a prompt.`);
    }

    if (question.type === "FILL") {
      if (isBlank(question.canonicalAnswer)) {
        throw badInput(`${label} needs a correct answer.`);
      }
      if (question.options.length > 0) {
        throw badInput(`${label} is fill in the blank, so it cannot have answers.`);
      }
      return;
    }

    if (!isBlank(question.canonicalAnswer)) {
      throw badInput(`${label} only takes a correct answer when it is fill in the blank.`);
    }

    if (question.type === "OPEN_QUESTION") {
      if (question.options.length > 0) {
        throw badInput(`${label} is an open question, so it cannot have answers.`);
      }
      return;
    }

    if (question.options.length < 2) {
      throw badInput(`${label} needs at least two answers.`);
    }

    if (question.options.some((option) => isBlank(option.text))) {
      throw badInput(`${label} has an empty answer.`);
    }

    const correctCount = question.options.filter((option) => option.isCorrect).length;

    if (question.type === "SINGLE_CHOICE" && correctCount !== 1) {
      throw badInput(`${label} needs exactly one correct answer.`);
    }

    if (question.type === "MULTIPLE_CHOICE" && correctCount === 0) {
      throw badInput(`${label} needs at least one correct answer.`);
    }
  });
}

/**
 * Writes the validated quiz and returns its id. Call inside a transaction; the
 * caller checks that the requester owns the node.
 */
export async function saveQuiz(
  tx: Prisma.TransactionClient,
  nodeId: string,
  input: SaveQuizInputShape,
): Promise<string> {
  const existingQuiz = await tx.quiz.findUnique({
    where: { nodeId },
    select: { id: true, deletedAt: true },
  });

  // Quiz.nodeId is unique, so a soft-deleted quiz is revived rather than
  // replaced; creating a second row for the node would fail.
  const quiz = existingQuiz
    ? await tx.quiz.update({
        where: { id: existingQuiz.id },
        data: {
          required: input.required,
          ...(existingQuiz.deletedAt ? { deletedAt: null } : {}),
        },
        select: { id: true },
      })
    : await tx.quiz.create({
        data: { nodeId, title: "Quiz", required: input.required },
        select: { id: true },
      });

  const existingQuestions = await tx.quizQuestion.findMany({
    where: { quizId: quiz.id },
    select: { id: true, type: true, options: { select: { id: true } } },
  });
  const existingById = new Map(existingQuestions.map((question) => [question.id, question]));

  input.questions.forEach((question, index) => {
    if (!question.id) return;

    const existing = existingById.get(question.id);
    if (!existing) {
      throw badInput(`Question ${index + 1} is not part of this quiz.`);
    }
    if (existing.type !== question.type) {
      throw badInput(`Question ${index + 1} already exists, so its type cannot be changed.`);
    }

    const ownOptionIds = new Set(existing.options.map((option) => option.id));
    question.options.forEach((option) => {
      if (option.id && !ownOptionIds.has(option.id)) {
        throw badInput(`An answer on question ${index + 1} is not part of this quiz.`);
      }
    });
  });

  const keptQuestionIds = new Set(
    input.questions.map((question) => question.id).filter((id): id is string => !!id),
  );
  const removedQuestionIds = existingQuestions
    .filter((question) => !keptQuestionIds.has(question.id))
    .map((question) => question.id);

  if (removedQuestionIds.length > 0) {
    await tx.quizQuestion.deleteMany({ where: { id: { in: removedQuestionIds } } });
  }

  for (const [index, question] of input.questions.entries()) {
    const data = {
      type: question.type,
      prompt: question.prompt.trim(),
      explanation: isBlank(question.explanation) ? null : question.explanation!.trim(),
      // The answer key only means anything for FILL; other types keep it null.
      canonicalAnswer:
        question.type === "FILL" && question.canonicalAnswer
          ? question.canonicalAnswer.trim()
          : null,
      order: index,
    };

    const savedQuestion = question.id
      ? await tx.quizQuestion.update({
          where: { id: question.id },
          data,
          select: { id: true },
        })
      : await tx.quizQuestion.create({
          data: { ...data, quizId: quiz.id },
          select: { id: true },
        });

    const keptOptionIds = new Set(
      question.options.map((option) => option.id).filter((id): id is string => !!id),
    );
    const removedOptionIds = (existingById.get(savedQuestion.id)?.options ?? [])
      .map((option) => option.id)
      .filter((id) => !keptOptionIds.has(id));

    if (removedOptionIds.length > 0) {
      await tx.quizOption.deleteMany({ where: { id: { in: removedOptionIds } } });
    }

    for (const [optionIndex, option] of question.options.entries()) {
      const optionData = {
        text: option.text.trim(),
        isCorrect: option.isCorrect,
        order: optionIndex,
      };

      if (option.id) {
        await tx.quizOption.update({ where: { id: option.id }, data: optionData });
      } else {
        await tx.quizOption.create({
          data: { ...optionData, questionId: savedQuestion.id },
        });
      }
    }
  }

  return quiz.id;
}
