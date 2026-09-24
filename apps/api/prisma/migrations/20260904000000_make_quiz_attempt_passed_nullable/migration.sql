-- Allow null to mean that a quiz attempt is waiting for manual review.
ALTER TABLE "QuizAttempt" ALTER COLUMN "passed" DROP NOT NULL;
