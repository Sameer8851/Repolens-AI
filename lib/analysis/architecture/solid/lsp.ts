import { InheritanceMetric } from "../../analyzers/inheritance";
import { SolidPrincipleAnalysis } from "./types";

export function analyzeLiskovSubstitution(
  inheritanceMetrics: InheritanceMetric[],
): SolidPrincipleAnalysis {
  if (inheritanceMetrics.length === 0) {
    return {
      score: 90,
      findings: ["No inheritance relationships were detected."],
      affectedFiles: [],
    };
  }

  const affectedFiles: string[] = [];

  let totalInheritance = 0;
  let totalOverrides = 0;

  for (const metric of inheritanceMetrics) {
    totalInheritance += metric.classesWithInheritance;
    totalOverrides += metric.overriddenMethods;

    if (metric.overriddenMethods > 0) {
      affectedFiles.push(metric.path);
    }
  }

  const findings: string[] = [];

  if (totalOverrides === 0) {
    findings.push(
      "Inheritance relationships were detected, but no overridden methods were found.",
    );
  } else {
    findings.push(
      `${totalInheritance} class inheritance relationship(s) and ${totalOverrides} overridden method(s) were detected.`,
    );

    findings.push(
      "Overridden methods should be reviewed to ensure derived classes preserve the expected behavior of their base classes.",
    );
  }

  const affectedPercentage =
    (affectedFiles.length / inheritanceMetrics.length) * 100;

  let score: number;

  if (totalOverrides === 0) {
    score = 90;
  } else if (affectedPercentage <= 10) {
    score = 80;
  } else if (affectedPercentage <= 25) {
    score = 70;
  } else {
    score = 60;
  }

  return {
    score,
    findings,
    affectedFiles,
  };
}