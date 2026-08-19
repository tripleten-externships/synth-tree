-- CreateTable
CREATE TABLE "UserXp" (
    "userId" TEXT NOT NULL,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "todayXp" INTEGER NOT NULL DEFAULT 0,
    "todayAsOf" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weeklyXp" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserXp_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "userId" TEXT NOT NULL,
    "currentDays" INTEGER NOT NULL DEFAULT 0,
    "longestDays" INTEGER NOT NULL DEFAULT 0,
    "lastActive" TIMESTAMP(3),

    CONSTRAINT "UserStreak_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "XpEvent_userId_createdAt_idx" ON "XpEvent"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserXp" ADD CONSTRAINT "UserXp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStreak" ADD CONSTRAINT "UserStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
