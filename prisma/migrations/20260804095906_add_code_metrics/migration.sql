-- CreateTable
CREATE TABLE "CodeMetric" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "functions" INTEGER NOT NULL,
    "classes" INTEGER NOT NULL,
    "interfaces" INTEGER NOT NULL,
    "imports" INTEGER NOT NULL,
    "exports" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeMetric_repositoryId_idx" ON "CodeMetric"("repositoryId");

-- AddForeignKey
ALTER TABLE "CodeMetric" ADD CONSTRAINT "CodeMetric_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
