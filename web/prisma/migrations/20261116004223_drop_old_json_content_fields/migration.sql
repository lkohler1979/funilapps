/*
  Warnings:

  - You are about to drop the column `diagnostico` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `ebookFeatures` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `labels` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `navigation` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `progressPhrases` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `quiz` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyPlan` on the `App` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "App" DROP COLUMN "diagnostico",
DROP COLUMN "ebookFeatures",
DROP COLUMN "labels",
DROP COLUMN "navigation",
DROP COLUMN "progressPhrases",
DROP COLUMN "quiz",
DROP COLUMN "theme",
DROP COLUMN "weeklyPlan";
