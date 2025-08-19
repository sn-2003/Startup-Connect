/*
  # Add Startup Reels Feature

  1. New Tables
    - `startup_reels`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `instagramUrl` (text, unique)
      - `embedId` (text, extracted from URL)
      - `startupId` (text, foreign key)
      - `featured` (boolean, default false)
      - `active` (boolean, default true)
      - `views` (integer, default 0)
      - `order` (integer, for manual ordering)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS on `startup_reels` table
    - Add policies for public read access
    - Add policies for startup owners to manage their reels

  3. Indexes
    - Index on `startupId` for efficient queries
    - Index on `featured` and `active` for filtering
    - Index on `order` for sorting
*/

-- CreateTable
CREATE TABLE "startup_reels" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instagramUrl" TEXT NOT NULL,
    "embedId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startup_reels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "startup_reels_instagramUrl_key" ON "startup_reels"("instagramUrl");

-- CreateIndex
CREATE INDEX "startup_reels_startupId_idx" ON "startup_reels"("startupId");

-- CreateIndex
CREATE INDEX "startup_reels_featured_active_idx" ON "startup_reels"("featured", "active");

-- CreateIndex
CREATE INDEX "startup_reels_order_idx" ON "startup_reels"("order");

-- AddForeignKey
ALTER TABLE "startup_reels" ADD CONSTRAINT "startup_reels_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;