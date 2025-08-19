/*
  Warnings:

  - The values [PLAYBOOK,TEMPLATE,GUIDE,TOOL] on the enum `resource_category` will be removed. If these variants are still used in the database, this will fail.
  - The values [PDF] on the enum `resource_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "resource_category_new" AS ENUM ('STARTUP_GUIDES', 'FUNDING_RESOURCES', 'HIRING_TEAM', 'MARKETING_BRANDING', 'TECH_TOOLS', 'LEARNING', 'COMMUNITY', 'GOVERNMENT', 'CASE_STUDIES', 'MISC');
ALTER TABLE "resources" ALTER COLUMN "category" TYPE "resource_category_new" USING ("category"::text::"resource_category_new");
ALTER TYPE "resource_category" RENAME TO "resource_category_old";
ALTER TYPE "resource_category_new" RENAME TO "resource_category";
DROP TYPE "resource_category_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "resource_type_new" AS ENUM ('LINK', 'ARTICLE', 'COURSE', 'TOOLKIT', 'TEMPLATE', 'VIDEO', 'PLATFORM', 'PODCAST', 'DIRECTORY', 'SERVICE', 'PORTAL', 'PROGRAM', 'COMMUNITY', 'BLOG', 'COLLECTION');
ALTER TABLE "resources" ALTER COLUMN "type" TYPE "resource_type_new" USING ("type"::text::"resource_type_new");
ALTER TYPE "resource_type" RENAME TO "resource_type_old";
ALTER TYPE "resource_type_new" RENAME TO "resource_type";
DROP TYPE "resource_type_old";
COMMIT;

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
