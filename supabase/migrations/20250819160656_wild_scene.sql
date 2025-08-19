/*
  # Add Coins Reward System

  1. New Tables
    - Add `coins` field to `users` table
    - `coin_transactions`
      - `id` (uuid, primary key)
      - `userId` (text, foreign key)
      - `amount` (integer, can be positive or negative)
      - `action` (text, describes what action earned/spent coins)
      - `description` (text, human readable description)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS on `coin_transactions` table
    - Add policies for users to read their own transactions
    - Only system can create transactions

  3. Indexes
    - Index on `userId` for efficient queries
    - Index on `createdAt` for sorting
*/

-- Add coins field to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'coins'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "coins" INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "coin_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coin_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "coin_transactions_userId_idx" ON "coin_transactions"("userId");
CREATE INDEX IF NOT EXISTS "coin_transactions_createdAt_idx" ON "coin_transactions"("createdAt");
CREATE INDEX IF NOT EXISTS "coin_transactions_action_idx" ON "coin_transactions"("action");

-- AddForeignKey
ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "coin_transactions" ENABLE ROW LEVEL SECURITY;

-- Create policies for coin transactions
CREATE POLICY "Users can read own coin transactions"
  ON "coin_transactions"
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = "userId");

-- Only system/admin can create coin transactions (no public insert policy)