/*
  Warnings:

  - You are about to drop the column `opcoes` on the `DiagnosticQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiagnosticQuestion" DROP COLUMN "opcoes";

-- CreateTable
CREATE TABLE "DiagnosticOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiagnosticOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiagnosticOption" ADD CONSTRAINT "DiagnosticOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "DiagnosticQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
