-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyGoalMinutes" INTEGER,
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: users created before this migration predate onboarding, so mark
-- them complete instead of forcing them through signup steps 2-3 (SYN-47).
-- New rows keep the column default of false.
UPDATE "User" SET "onboardingComplete" = true;
