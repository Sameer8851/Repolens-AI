import { ScannedFile } from "./scanner/types";
import { LanguageAnalysisResult } from "./analyzers/language";
import { DetectedFramework } from "./analyzers/framework";
import { DetectedDependency } from "./analyzers/dependency";
import { ProjectStructure } from "./analyzers/project-structure";
import { ArchitectureAnalysis } from "./analyzers/architecture";
import { RepositoryMetrics } from "./analyzers/metrics";
import { FileCodeMetric } from "./analyzers/code-metrics";

export interface AnalysisResult {
  files: ScannedFile[];
  languages: LanguageAnalysisResult[];
  frameworks: DetectedFramework[];
  dependencies: DetectedDependency[];
  structure: ProjectStructure;
  architecture: ArchitectureAnalysis;
  metrics: RepositoryMetrics;
  codeMetrics: FileCodeMetric[];
}