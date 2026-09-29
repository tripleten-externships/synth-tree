-- CreateTable
CREATE TABLE "UserDailyQuest" (
    "userId" TEXT NOT NULL,
    "questKey" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "goal" INTEGER NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserDailyQuest_pkey" PRIMARY KEY ("userId","questKey","date")
);

-- CreateIndex
CREATE INDEX "UserDailyQuest_userId_date_idx" ON "UserDailyQuest"("userId", "date");

-- AddForeignKey
ALTER TABLE "UserDailyQuest" ADD CONSTRAINT "UserDailyQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
