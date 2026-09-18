import { FileCodeMetric } from "../../analyzers/code-metrics";
import { analyzeSingleResponsibility } from "./srp";
import { SolidAnalysis } from "./types";

export function analyzeSolid(
  codeMetrics: FileCodeMetric[],
): SolidAnalysis {
  const singleResponsibility =
    analyzeSingleResponsibility(codeMetrics);

  return {
    singleResponsibility,
    openClosed: {
      score: 0,
      findings: [],
      affectedFiles: [],
    },
    liskovSubstitution: {
      score: 0,
      findings: [],
      affectedFiles: [],
    },
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