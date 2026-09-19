import { ProjectStructure } from "../analyzers/project-structure";
import { analyzeLayerSeparation } from "./layers";
import { ArchitectureIntelligence } from "./types";
import { analyzeCoupling } from "./coupling";
import { analyzeCohesion } from "./cohesion";
import { FileCodeMetric } from "../analyzers/code-metrics";
import { InheritanceMetric } from "../analyzers/inheritance";
import { analyzeSolid } from "./solid";

export function analyzeArchitectureIntelligence(
  structure: ProjectStructure,
  dependencyGraph: Map<string, string[]>,
  codeMetrics: FileCodeMetric[],
  inheritanceMetrics: InheritanceMetric[],
): ArchitectureIntelligence {
  const layerSeparation = analyzeLayerSeparation(structure);
  const coupling =
    analyzeCoupling(dependencyGraph);
    const cohesion = analyzeCohesion(codeMetrics);
    const solid = analyzeSolid(codeMetrics, inheritanceMetrics);

  return {
    layerSeparation,

    coupling,

    cohesion,

    solid,

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