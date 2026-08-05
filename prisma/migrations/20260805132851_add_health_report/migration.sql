-- CreateTable
CREATE TABLE "HealthReport" (
    "id" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "documentationScore" INTEGER NOT NULL,
    "architectureScore" INTEGER NOT NULL,
    "dependencyScore" INTEGER NOT NULL,
    "codeQualityScore" INTEGER NOT NULL,
    "repositoryScore" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthReport_repositoryId_key" ON "HealthReport"("repositoryId");

-- AddForeignKey
ALTER TABLE "HealthReport" ADD CONSTRAINT "HealthReport_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
