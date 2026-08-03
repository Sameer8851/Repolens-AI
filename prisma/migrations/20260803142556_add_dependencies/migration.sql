-- CreateEnum
CREATE TYPE "DependencyType" AS ENUM ('PRODUCTION', 'DEVELOPMENT');

-- CreateTable
CREATE TABLE "Dependency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "type" "DependencyType" NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dependency_repositoryId_idx" ON "Dependency"("repositoryId");

-- CreateIndex
CREATE INDEX "Dependency_type_idx" ON "Dependency"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Dependency_repositoryId_name_key" ON "Dependency"("repositoryId", "name");

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
