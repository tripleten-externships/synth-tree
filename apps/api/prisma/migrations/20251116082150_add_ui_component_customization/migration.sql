-- CreateTable
CREATE TABLE "UIComponentCustomization" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UIComponentCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UIComponentCustomization_instanceId_key" ON "UIComponentCustomization"("instanceId");

-- CreateIndex
CREATE INDEX "UIComponentCustomization_componentType_idx" ON "UIComponentCustomization"("componentType");

-- CreateIndex
CREATE INDEX "UIComponentCustomization_instanceId_idx" ON "UIComponentCustomization"("instanceId");

-- AddForeignKey
ALTER TABLE "UIComponentCustomization" ADD CONSTRAINT "UIComponentCustomization_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
