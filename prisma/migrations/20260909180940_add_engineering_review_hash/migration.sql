/*
  Warnings:

  - Added the required column `analysisHash` to the `EngineeringReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EngineeringReview" ADD COLUMN     "analysisHash" TEXT NOT NULL;
