import { FileCodeMetric } from "../../analyzers/code-metrics";
import { SolidPrincipleAnalysis } from "./types";

export function analyzeOpenClosed(
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
    if (metric.conditionalBranches > 10) {
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
      "Few files show high conditional branching that could make extension more difficult.",
    );
  } else if (affectedPercentage <= 15) {
    score = 75;
    findings.push(
      "Some files contain substantial conditional branching that may increase modification effort when adding new behavior.",
    );
  } else if (affectedPercentage <= 30) {
    score = 55;
    findings.push(
      "A significant number of files contain high conditional branching and may warrant review for extensibility.",
    );
  } else {
    score = 35;
    findings.push(
      "Many files contain high conditional branching, which may make extending behavior more modification-heavy.",
    );
  }

  if (affectedFiles.length > 0) {
    findings.push(
      `${affectedFiles.length} of ${codeMetrics.length} analyzed files exceeded the configured branching threshold.`,
    );
  } else {
    findings.push(
      "No files exceeded the configured OCP warning threshold.",
    );
  }

  return {
    score,
    findings,
    affectedFiles,
  };
}