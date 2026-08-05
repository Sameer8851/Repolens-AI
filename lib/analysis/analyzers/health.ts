import { ScannedFile } from "../scanner/types";
import { LanguageAnalysisResult } from "./language";
import { DetectedFramework } from "./framework";
import { DetectedDependency } from "./dependency";
import { ProjectStructure } from "./project-structure";
import { ArchitectureAnalysis } from "./architecture";
import { RepositoryMetrics } from "./metrics";
import { FileCodeMetric } from "./code-metrics";

interface HealthAnalysisInput {
  files: ScannedFile[];
  languages: LanguageAnalysisResult[];
  frameworks: DetectedFramework[];
  dependencies: DetectedDependency[];
  structure: ProjectStructure;
  architecture: ArchitectureAnalysis;
  metrics: RepositoryMetrics;
  codeMetrics: FileCodeMetric[];
}

export interface HealthAnalysis {
  overallScore: number;
  grade: string;

  documentationScore: number;
  architectureScore: number;
  dependencyScore: number;
  codeQualityScore: number;
  repositoryScore: number;
}

export function analyzeHealth(analysis: HealthAnalysisInput): HealthAnalysis {
  let documentationScore = 15;
  let architectureScore = 20;
  let dependencyScore = 15;
  let codeQualityScore = 20;
  let repositoryScore = 20;

  const hasReadme = analysis.files.some(
    (file) => file.name.toLowerCase() === "readme.md",
  );

  if (!hasReadme) {
    documentationScore = 5;
  }
  if (analysis.architecture.architecture === "Unknown") {
    architectureScore = 10;
  }
  if (analysis.dependencies.length > 100) {
    dependencyScore = 10;
  }
  if (analysis.metrics.averageFileSize > 250) {
    repositoryScore -= 5;
  }

  if (analysis.metrics.totalFiles < 5) {
    repositoryScore -= 5;
  }
  const totalFunctions = analysis.codeMetrics.reduce(
    (sum, file) => sum + file.functions,
    0,
  );

  if (
    analysis.codeMetrics.length > 0 &&
    totalFunctions / analysis.codeMetrics.length > 10
  ) {
    codeQualityScore -= 5;
  }
  const overallScore =
    documentationScore +
    architectureScore +
    dependencyScore +
    codeQualityScore +
    repositoryScore;
  let grade = "F";

  if (overallScore >= 90) grade = "A";
  else if (overallScore >= 80) grade = "B";
  else if (overallScore >= 70) grade = "C";
  else if (overallScore >= 60) grade = "D";
  return {
    overallScore,
    grade,
    documentationScore,
    architectureScore,
    dependencyScore,
    codeQualityScore,
    repositoryScore,
  };
}
