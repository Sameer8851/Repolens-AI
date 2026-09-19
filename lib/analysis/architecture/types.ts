import { SolidAnalysis } from "./solid/types";
export interface ArchitectureIntelligence {
  layerSeparation: {
    score: number;
    findings: string[];
  };

  coupling: {
    score: number;
    findings: string[];
    averageDependencies: number;
  };

  cohesion: {
    score: number;
    findings: string[];
  };

  solid: SolidAnalysis;

  designPatterns: {
    detected: string[];
    findings: string[];
  };

  scalability: {
    score: number;
    findings: string[];
  };

  overallScore: number;
}