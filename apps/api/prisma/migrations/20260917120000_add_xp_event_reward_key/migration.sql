-- AlterTable
ALTER TABLE "XpEvent" ADD COLUMN     "rewardKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "XpEvent_userId_reason_rewardKey_key" ON "XpEvent"("userId", "reason", "rewardKey");
