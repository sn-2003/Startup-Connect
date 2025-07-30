-- CreateEnum
CREATE TYPE "news_category" AS ENUM ('STARTUP', 'INVESTMENT', 'TECHNOLOGY', 'MARKETING', 'DESIGN', 'PRODUCTIVITY', 'ANALYTICS', 'FINANCE', 'COMMUNICATION', 'CAREERS', 'GENERAL');

-- CreateEnum
CREATE TYPE "news_source_type" AS ENUM ('RSS', 'CURATED', 'USER_SUBMITTED');

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "category" "news_category" NOT NULL,
    "readTime" TEXT,
    "image" TEXT,
    "author" TEXT,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sourceType" "news_source_type" NOT NULL DEFAULT 'RSS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_bookmarks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,

    CONSTRAINT "news_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_bookmarks_userId_newsId_key" ON "news_bookmarks"("userId", "newsId");

-- AddForeignKey
ALTER TABLE "news_bookmarks" ADD CONSTRAINT "news_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_bookmarks" ADD CONSTRAINT "news_bookmarks_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE; 