-- CreateTable
CREATE TABLE "EngineeringReview" (
    "id" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "architectureReview" TEXT NOT NULL,
    "strengths" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngineeringReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EngineeringReview_repositoryId_key" ON "EngineeringReview"("repositoryId");

-- AddForeignKey
ALTER TABLE "EngineeringReview" ADD CONSTRAINT "EngineeringReview_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
