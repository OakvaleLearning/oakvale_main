-- CreateTable
CREATE TABLE "BuildBrief" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organisationType" TEXT,
    "moduleCount" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuildBrief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BuildBrief_createdAt_idx" ON "BuildBrief"("createdAt");

-- CreateIndex
CREATE INDEX "BuildBrief_email_idx" ON "BuildBrief"("email");
