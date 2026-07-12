-- CreateTable
CREATE TABLE "NewInstitutionRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewInstitutionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewInstitutionRequest_email_key" ON "NewInstitutionRequest"("email");
