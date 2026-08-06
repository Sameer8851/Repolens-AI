-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'FIXED', 'IGNORED');

-- CreateTable
CREATE TABLE "RepositoryIssue" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "IssueSeverity" NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "message" TEXT NOT NULL,
    "filePath" TEXT,
    "lineNumber" INTEGER,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepositoryIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RepositoryIssue_repositoryId_idx" ON "RepositoryIssue"("repositoryId");

-- CreateIndex
CREATE INDEX "RepositoryIssue_severity_idx" ON "RepositoryIssue"("severity");

-- CreateIndex
CREATE INDEX "RepositoryIssue_type_idx" ON "RepositoryIssue"("type");

-- AddForeignKey
ALTER TABLE "RepositoryIssue" ADD CONSTRAINT "RepositoryIssue_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
