import { FileCodeMetric } from "../../analyzers/code-metrics";
import { SolidPrincipleAnalysis } from "./types";

export function analyzeSingleResponsibility(
  codeMetrics: FileCodeMetric[],
): SolidPrincipleAnalysis {
  if (codeMetrics.length === 0) {
    return {
      score: 0,
      findings: ["No analyzable files were found."],
      affectedFiles: [],
    };
  }

  const affectedFiles: string[] = [];

  for (const metric of codeMetrics) {
    const hasManyFunctions = metric.functions > 20;
    const hasManyClasses = metric.classes > 5;

    if (hasManyFunctions || hasManyClasses) {
      affectedFiles.push(metric.path);
    }
  }

  const affectedPercentage =
    (affectedFiles.length / codeMetrics.length) * 100;

  let score: number;
  const findings: string[] = [];

  if (affectedPercentage <= 5) {
    score = 90;
    findings.push(
      "Few files show structural signals of potentially concentrated responsibilities.",
    );
  } else if (affectedPercentage <= 15) {
    score = 75;
    findings.push(
      "Some files show structural signals that may indicate multiple responsibilities.",
    );
  } else if (affectedPercentage <= 30) {
    score = 55;
    findings.push(
      "A significant number of files show structural signals of potentially concentrated responsibilities.",
    );
  } else {
    score = 35;
    findings.push(
      "Many files show structural signals that may indicate multiple responsibilities.",
    );
  }

  if (affectedFiles.length > 0) {
    findings.push(
      `${affectedFiles.length} of ${codeMetrics.length} analyzed files require further SRP inspection.`,
    );
  } else {
    findings.push(
      "No files exceeded the configured SRP warning thresholds.",
    );
  }

  return {
    score,
    findings,
    affectedFiles,
  };
}