-- AlterTable
ALTER TABLE "App" ADD COLUMN     "diagnosticoBoaNoticia" TEXT,
ADD COLUMN     "diagnosticoPlanoTexto" TEXT,
ADD COLUMN     "diagnosticoPlanoTitulo" TEXT;

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "icon" TEXT,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppLabel" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "AppLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanWeek" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlanWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanDay" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlanDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanExercise" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reps" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "desc" TEXT,
    "steps" TEXT[],
    "tip" TEXT,
    "type" TEXT,
    "series" INTEGER,
    "video" TEXT,

    CONSTRAINT "PlanExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticQuestion" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "opcoes" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiagnosticQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticAlert" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiagnosticAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticMetric" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "n" TEXT NOT NULL,
    "de" TEXT NOT NULL,
    "para" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiagnosticMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressPhrase" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgressPhrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookFeature" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "icon" TEXT,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EbookFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppLabel_appId_key_key" ON "AppLabel"("appId", "key");

-- AddForeignKey
ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppLabel" ADD CONSTRAINT "AppLabel_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanWeek" ADD CONSTRAINT "PlanWeek_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDay" ADD CONSTRAINT "PlanDay_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "PlanWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanExercise" ADD CONSTRAINT "PlanExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "PlanDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticQuestion" ADD CONSTRAINT "DiagnosticQuestion_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticAlert" ADD CONSTRAINT "DiagnosticAlert_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticMetric" ADD CONSTRAINT "DiagnosticMetric_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressPhrase" ADD CONSTRAINT "ProgressPhrase_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookFeature" ADD CONSTRAINT "EbookFeature_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
