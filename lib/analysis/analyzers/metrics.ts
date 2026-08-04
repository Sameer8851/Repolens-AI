import { ScannedFile } from "../scanner/types";

export interface RepositoryMetrics {
  totalFiles: number;
  totalLines: number;
  averageFileSize: number;
}

export function analyzeMetrics(
  files: ScannedFile[],
): RepositoryMetrics {
  const totalFiles = files.length;

  const totalLines = files.reduce(
    (sum, file) => sum + file.lineCount,
    0,
  );

  const averageFileSize =
    totalFiles === 0 ? 0 : totalLines / totalFiles;

  return {
    totalFiles,
    totalLines,
    averageFileSize,
  };
}