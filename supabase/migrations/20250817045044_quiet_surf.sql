/*
  # Add User Reel Order System

  1. New Tables
    - `user_reel_orders`
      - `id` (uuid, primary key)
      - `userId` (text, foreign key)
      - `reelOrder` (json array of reel IDs)
      - `lastSeenIndex` (integer, default -1)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS on `user_reel_orders` table
    - Add policies for users to manage their own reel order

  3. Indexes
    - Index on `userId` for efficient queries
    - Unique constraint on `userId` (one order per user)
*/

-- CreateTable
CREATE TABLE IF NOT EXISTS "user_reel_orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reelOrder" JSONB NOT NULL DEFAULT '[]',
    "lastSeenIndex" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_reel_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "user_reel_orders_userId_key" ON "user_reel_orders"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_reel_orders_userId_idx" ON "user_reel_orders"("userId");

-- AddForeignKey
ALTER TABLE "user_reel_orders" ADD CONSTRAINT "user_reel_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "user_reel_orders" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own reel order"
  ON "user_reel_orders"
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own reel order"
  ON "user_reel_orders"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own reel order"
  ON "user_reel_orders"
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own reel order"
  ON "user_reel_orders"
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = "userId");