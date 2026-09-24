-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'FILL';

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "canonicalAnswer" TEXT;
