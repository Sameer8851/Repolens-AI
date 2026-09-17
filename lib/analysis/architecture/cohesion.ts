import { FileCodeMetric } from "../analyzers/code-metrics";

export interface CohesionAnalysis {
  score: number;
  findings: string[];
  affectedFiles: string[];
}

export function analyzeCohesion(
  codeMetrics: FileCodeMetric[],
): CohesionAnalysis {
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
      "Most files have a focused amount of functionality with few files showing responsibility concentration signals.",
    );
  } else if (affectedPercentage <= 15) {
    score = 75;
    findings.push(
      "Some files contain a high concentration of functionality and may benefit from responsibility separation.",
    );
  } else if (affectedPercentage <= 30) {
    score = 55;
    findings.push(
      "A significant portion of files contain concentrated functionality, indicating possible responsibility separation issues.",
    );
  } else {
    score = 35;
    findings.push(
      "Many files contain highly concentrated functionality, indicating a stronger need to examine module responsibilities.",
    );
  }

  if (affectedFiles.length > 0) {
    findings.push(
      `${affectedFiles.length} of ${codeMetrics.length} analyzed files show potential responsibility concentration.`,
    );
  } else {
    findings.push(
      "No files exceeded the configured cohesion warning thresholds.",
    );
  }

  return {
    score,
    findings,
    affectedFiles,
  };
}