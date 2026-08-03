import { rm } from "fs/promises";

import { cloneRepository } from "@/lib/analysis/scanner/clone";
import { scanRepository } from "@/lib/analysis/scanner/scan";

import { AnalysisResult } from "./types";
import { analyzeLanguages } from "@/lib/analysis/analyzers/language";
import { readPackageJson } from "./parsers/package-json";
import { analyzePackageJson } from "./analyzers/framework";

export async function runStaticAnalysis(
  cloneUrl: string,
  accessToken: string,
): Promise<AnalysisResult> {
  const repositoryPath = await cloneRepository(
    cloneUrl,
    accessToken,
  );

  try {
    const scanResult = await scanRepository(repositoryPath);
    const languages = analyzeLanguages(scanResult.files);
    const packageJson = await readPackageJson(repositoryPath);

    const frameworks = packageJson
  ? analyzePackageJson(packageJson)
  : [];

    return {
  files: scanResult.files,
  languages,
  frameworks,
};
  } finally {
    await rm(repositoryPath, {
      recursive: true,
      force: true,
    });
  }
}