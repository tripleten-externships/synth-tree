-- AlterTable
ALTER TABLE "QuizOption" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- Backfill: existing options have no explicit order, so keep the order they
-- were created in. Without this every option would share order 0 and sorting
-- on it would be arbitrary.
UPDATE "QuizOption" AS o
SET "order" = numbered.position
FROM (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "questionId" ORDER BY "createdAt", id) - 1 AS position
  FROM "QuizOption"
) AS numbered
WHERE o.id = numbered.id;
