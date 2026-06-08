-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Waived', 'Rejected');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Submitted', 'UnderReview', 'Accepted', 'Declined');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "yearOfStudy" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "trackFirst" TEXT NOT NULL,
    "trackSecond" TEXT,
    "mot1" TEXT NOT NULL,
    "mot2" TEXT NOT NULL,
    "needsAid" BOOLEAN NOT NULL DEFAULT false,
    "aidLevel" TEXT,
    "aidStatement" TEXT,
    "aidFiles" JSONB,
    "fileCount" INTEGER NOT NULL DEFAULT 0,
    "consentTruth" BOOLEAN NOT NULL DEFAULT false,
    "consentContact" BOOLEAN NOT NULL DEFAULT false,
    "consentTerms" BOOLEAN NOT NULL DEFAULT false,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'Submitted',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- CreateIndex
CREATE INDEX "Application_paymentStatus_idx" ON "Application"("paymentStatus");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
