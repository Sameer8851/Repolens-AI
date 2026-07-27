-- CreateTable
CREATE TABLE "RepositoryAnalysis" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "techStack" TEXT[],
    "difficulty" TEXT,
    "architecture" TEXT,
    "suggestions" TEXT[],
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepositoryAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryAnalysis_repositoryId_key" ON "RepositoryAnalysis"("repositoryId");

-- AddForeignKey
ALTER TABLE "RepositoryAnalysis" ADD CONSTRAINT "RepositoryAnalysis_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
