export interface LanguageFile {
  language?: string | null;
  lineCount: number;
}

export interface LanguageAnalysisResult {
  language: string;
  fileCount: number;
  lineCount: number;
  percentage: number;
}

export function analyzeLanguages(
  files: LanguageFile[],
): LanguageAnalysisResult[] {
  const stats = new Map<
    string,
    {
      fileCount: number;
      lineCount: number;
    }
  >();

  let totalLines = 0;

  for (const file of files) {
    if (!file.language) {
      continue;
    }

    totalLines += file.lineCount;

    const current = stats.get(file.language);

    if (current) {
      current.fileCount++;
      current.lineCount += file.lineCount;
    } else {
      stats.set(file.language, {
        fileCount: 1,
        lineCount: file.lineCount,
      });
    }
  }

  return [...stats.entries()].map(([language, value]) => ({
    language,
    fileCount: value.fileCount,
    lineCount: value.lineCount,
    percentage:
      totalLines === 0
        ? 0
        : Number(((value.lineCount / totalLines) * 100).toFixed(2)),
  }));
}
