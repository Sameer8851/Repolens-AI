import { FileCodeMetric } from "../../analyzers/code-metrics";
import { analyzeSingleResponsibility } from "./srp";
import { SolidAnalysis } from "./types";
import { analyzeOpenClosed } from "./ocp";
import { analyzeLiskovSubstitution } from "./lsp";
import { InheritanceMetric } from "../../analyzers/inheritance";

export function analyzeSolid(
  codeMetrics: FileCodeMetric[],
  inheritanceMetrics: InheritanceMetric[],
): SolidAnalysis {
  const singleResponsibility =
    analyzeSingleResponsibility(codeMetrics);

  const openClosed =
    analyzeOpenClosed(codeMetrics);
  const liskovSubstitution =
    analyzeLiskovSubstitution(inheritanceMetrics);
  return {
    singleResponsibility,
    openClosed,
    liskovSubstitution,
    interfaceSegregation: {
      score: 0,
      findings: [],
      affectedFiles: [],
    },
    dependencyInversion: {
      score: 0,
      findings: [],
      affectedFiles: [],
    },
  };
}