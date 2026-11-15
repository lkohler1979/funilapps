/*
  Warnings:

  - You are about to drop the column `appId` on the `Purchase` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_appId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "appId",
ADD COLUMN     "appIds" TEXT[];

-- CreateTable
CREATE TABLE "RelatedApp" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "relatedAppId" TEXT NOT NULL,
    "comboPriceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RelatedApp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelatedApp_appId_relatedAppId_key" ON "RelatedApp"("appId", "relatedAppId");

-- AddForeignKey
ALTER TABLE "RelatedApp" ADD CONSTRAINT "RelatedApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedApp" ADD CONSTRAINT "RelatedApp_relatedAppId_fkey" FOREIGN KEY ("relatedAppId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
