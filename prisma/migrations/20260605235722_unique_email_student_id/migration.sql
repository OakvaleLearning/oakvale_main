-- Normalise existing emails so the case-insensitive uniqueness check is meaningful.
UPDATE "Application" SET "email" = lower(trim("email"));

-- Add unique constraints. If pre-existing duplicates exist this statement will fail
-- and the duplicates must be resolved manually before re-running.
CREATE UNIQUE INDEX "Application_email_key" ON "Application"("email");
CREATE UNIQUE INDEX "Application_studentId_key" ON "Application"("studentId");
