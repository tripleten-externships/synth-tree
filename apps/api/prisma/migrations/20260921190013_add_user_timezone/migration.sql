/*
  Warnings:

  - A unique constraint covering the columns `[userId,reason,rewardKey]` on the table `XpEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "XpEvent" ADD COLUMN     "rewardKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "XpEvent_userId_reason_rewardKey_key" ON "XpEvent"("userId", "reason", "rewardKey");
