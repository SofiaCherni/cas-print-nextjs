-- CreateEnum
CREATE TYPE "CutStyle" AS ENUM ('CLASSIC', 'OVERSIZE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cutStyle" "CutStyle";
