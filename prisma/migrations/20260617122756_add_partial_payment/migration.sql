-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'Partial';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "amountPaidKobo" INTEGER;
