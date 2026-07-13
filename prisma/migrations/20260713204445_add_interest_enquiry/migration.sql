-- CreateTable
CREATE TABLE "InterestEnquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "state" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "discipline" TEXT,
    "individualInstitution" TEXT,
    "yearOfStudy" TEXT,
    "institutionName" TEXT,
    "institutionRole" TEXT,
    "cityOrArea" TEXT,
    "connectedSchool" TEXT,
    "message" TEXT,
    "heardVia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterestEnquiry_createdAt_idx" ON "InterestEnquiry"("createdAt");

-- CreateIndex
CREATE INDEX "InterestEnquiry_interest_idx" ON "InterestEnquiry"("interest");
