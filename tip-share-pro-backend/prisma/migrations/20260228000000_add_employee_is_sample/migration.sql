-- Add is_sample flag to employees for sample data cleanup
ALTER TABLE "employees" ADD COLUMN "is_sample" BOOLEAN NOT NULL DEFAULT false;
