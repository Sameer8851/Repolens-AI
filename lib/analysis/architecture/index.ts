import { ProjectStructure } from "../analyzers/project-structure";
import { analyzeLayerSeparation } from "./layers";
import { ArchitectureIntelligence } from "./types";
import { analyzeCoupling } from "./coupling";
import { analyzeCohesion } from "./cohesion";
import { FileCodeMetric } from "../analyzers/code-metrics";

export function analyzeArchitectureIntelligence(
  structure: ProjectStructure,
  dependencyGraph: Map<string, string[]>,
  codeMetrics: FileCodeMetric[],
): ArchitectureIntelligence {
  const layerSeparation = analyzeLayerSeparation(structure);
  const coupling =
    analyzeCoupling(dependencyGraph);
    const cohesion = analyzeCohesion(codeMetrics);

  return {
    layerSeparation,

    coupling,

    cohesion,

    solid: {
      score: 0,
      findings: [],
    },

    designPatterns: {
      detected: [],
      findings: [],
    },

    scalability: {
      score: 0,
      findings: [],
    },

    overallScore: Math.round(
      (layerSeparation.score +
        coupling.score +
        cohesion.score) / 3,
    ),
  };
}