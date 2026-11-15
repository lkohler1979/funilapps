-- AlterTable
ALTER TABLE "App" ADD COLUMN     "priceCents" INTEGER NOT NULL DEFAULT 1997;

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "appId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeSessionId_key" ON "Purchase"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Purchase_email_idx" ON "Purchase"("email");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE SET NULL ON UPDATE CASCADE;
