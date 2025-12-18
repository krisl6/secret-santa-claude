-- AlterTable
ALTER TABLE "public"."Participant" ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Participant_email_idx" ON "public"."Participant"("email");
