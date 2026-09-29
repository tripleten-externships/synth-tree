-- CreateTable
CREATE TABLE "UserHearts" (
    "userId" TEXT NOT NULL,
    "currentHearts" INTEGER NOT NULL DEFAULT 5,
    "lastRefilledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHearts_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserHearts" ADD CONSTRAINT "UserHearts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
