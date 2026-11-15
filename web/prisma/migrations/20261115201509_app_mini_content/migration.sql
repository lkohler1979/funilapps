-- AlterTable
ALTER TABLE "App" ADD COLUMN     "diagnostico" JSONB,
ADD COLUMN     "ebookFeatures" JSONB,
ADD COLUMN     "ebookPdfUrl" TEXT,
ADD COLUMN     "ebookSubtitle" TEXT,
ADD COLUMN     "ebookTitle" TEXT,
ADD COLUMN     "heroBadge" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "labels" JSONB,
ADD COLUMN     "navigation" JSONB,
ADD COLUMN     "news" JSONB,
ADD COLUMN     "progressPhrases" JSONB,
ADD COLUMN     "quiz" JSONB,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "theme" JSONB,
ADD COLUMN     "weeklyPlan" JSONB;

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "cardDesc" TEXT,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT,
    "url" TEXT NOT NULL,
    "free" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoLesson" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "num" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VideoLesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLesson" ADD CONSTRAINT "VideoLesson_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
