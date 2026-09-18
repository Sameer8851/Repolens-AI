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

  solid: {
    score: number;
    findings: string[];
  };

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