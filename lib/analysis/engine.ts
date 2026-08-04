import { rm } from "fs/promises";

import { cloneRepository } from "@/lib/analysis/scanner/clone";
import { scanRepository } from "@/lib/analysis/scanner/scan";

import { AnalysisResult } from "./types";
import { analyzeLanguages } from "@/lib/analysis/analyzers/language";
import { readPackageJson } from "./parsers/package-json";
import { analyzePackageJson } from "./analyzers/framework";
import { analyzeDependencies } from "./analyzers/dependency";
import { analyzeProjectStructure } from "./analyzers/project-structure";
import { analyzeArchitecture } from "./analyzers/architecture";
import { analyzeMetrics } from "./analyzers/metrics";
import { analyzeCodeMetrics } from "./analyzers/code-metrics";

export async function runStaticAnalysis(
  cloneUrl: string,
  accessToken: string,
): Promise<AnalysisResult> {
  const repositoryPath = await cloneRepository(cloneUrl, accessToken);

  try {
    const scanResult = await scanRepository(repositoryPath);
    const languages = analyzeLanguages(scanResult.files);
    const packageJson = await readPackageJson(repositoryPath);

    const frameworks = packageJson ? analyzePackageJson(packageJson) : [];
    const dependencies = packageJson ? analyzeDependencies(packageJson) : [];
    const structure = analyzeProjectStructure(scanResult.files);
    const architecture = analyzeArchitecture(structure);
    const metrics = analyzeMetrics(scanResult.files);
    const codeMetrics = [];

    for (const file of scanResult.files) {
      if (!["ts", "tsx", "js", "jsx"].includes(file.extension)) {
        continue;
      }

      const metric = await analyzeCodeMetrics(
        scanResult.repositoryPath,
        file.path,
      );

      codeMetrics.push(metric);
    }

    return {
      files: scanResult.files,
      languages,
      frameworks,
      dependencies,
      structure,
      architecture,
      metrics,
      codeMetrics,
    };
  } finally {
    await rm(repositoryPath, {
      recursive: true,
      force: true,
    });
  }
}
