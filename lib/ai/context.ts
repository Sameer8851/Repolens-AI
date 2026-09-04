import { AnalysisResult } from "../analysis/types";

export interface EngineeringContext {
    repository: {
        name: string;
        description: string | null;
        language: string | null;
    };

    languages: AnalysisResult["languages"];
    frameworks: AnalysisResult["frameworks"];
    dependencies: AnalysisResult["dependencies"];

    structure: AnalysisResult["structure"];
    architecture: AnalysisResult["architecture"];

    metrics: AnalysisResult["metrics"];
    codeMetrics: AnalysisResult["codeMetrics"];
    health: AnalysisResult["health"];

    issues: AnalysisResult["issues"];

}

export interface RepositoryMetadata {
    name: string;
    description: string | null;
    language: string | null;
}

export function buildEngineeringContext(
  repository: RepositoryMetadata,
  analysis: AnalysisResult,
): EngineeringContext {
  return {
    repository,

    languages: analysis.languages,
    frameworks: analysis.frameworks,
    dependencies: analysis.dependencies,

    structure: analysis.structure,
    architecture: analysis.architecture,

    metrics: analysis.metrics,
    codeMetrics: analysis.codeMetrics,
    health: analysis.health,

    issues: analysis.issues,
  };
}