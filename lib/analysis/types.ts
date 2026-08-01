import { ScannedFile } from "@/lib/analysis/scanner/types";
import { LanguageAnalysisResult } from "@/lib/analysis/analyzers/language";
import { DetectedFramework } from "@/lib/analysis/analyzers/framework";

export interface AnalysisResult {
  files: ScannedFile[];
  languages: LanguageAnalysisResult[];
  frameworks: DetectedFramework[];
}