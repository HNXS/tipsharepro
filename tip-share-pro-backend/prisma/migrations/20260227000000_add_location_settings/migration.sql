-- AlterTable
ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "settings" JSONB NOT NULL DEFAULT '{}';
