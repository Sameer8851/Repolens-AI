export interface SolidPrincipleAnalysis {
  score: number;
  findings: string[];
  affectedFiles: string[];
}

export interface SolidAnalysis {
  singleResponsibility: SolidPrincipleAnalysis;
  openClosed: SolidPrincipleAnalysis;
  liskovSubstitution: SolidPrincipleAnalysis;
  interfaceSegregation: SolidPrincipleAnalysis;
  dependencyInversion: SolidPrincipleAnalysis;
}