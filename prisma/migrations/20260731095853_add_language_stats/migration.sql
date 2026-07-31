-- CreateTable
CREATE TABLE "LanguageStat" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "fileCount" INTEGER NOT NULL,
    "lineCount" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LanguageStat_repositoryId_idx" ON "LanguageStat"("repositoryId");

-- AddForeignKey
ALTER TABLE "LanguageStat" ADD CONSTRAINT "LanguageStat_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
