-- CreateTable
CREATE TABLE "RepositoryMetric" (
    "id" TEXT NOT NULL,
    "totalFiles" INTEGER NOT NULL,
    "totalLines" INTEGER NOT NULL,
    "averageFileSize" DOUBLE PRECISION NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepositoryMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryMetric_repositoryId_key" ON "RepositoryMetric"("repositoryId");

-- AddForeignKey
ALTER TABLE "RepositoryMetric" ADD CONSTRAINT "RepositoryMetric_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
