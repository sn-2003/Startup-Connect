-- CreateEnum
CREATE TYPE "ToolCategory" AS ENUM ('DEVELOPMENT', 'DESIGN', 'MARKETING', 'PRODUCTIVITY', 'ANALYTICS', 'FINANCE', 'COMMUNICATION', 'AI');

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ToolCategory" NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "users" TEXT NOT NULL DEFAULT '0',
    "pricing" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_ratings" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "tool_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "tool_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tool_ratings_userId_toolId_key" ON "tool_ratings"("userId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "tool_favorites_userId_toolId_key" ON "tool_favorites"("userId", "toolId");

-- AddForeignKey
ALTER TABLE "tool_ratings" ADD CONSTRAINT "tool_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_ratings" ADD CONSTRAINT "tool_ratings_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_favorites" ADD CONSTRAINT "tool_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_favorites" ADD CONSTRAINT "tool_favorites_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE; 