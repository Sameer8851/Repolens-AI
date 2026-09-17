import { ProjectStructure } from "../analyzers/project-structure";

export interface LayerAnalysis {
  score: number;
  findings: string[];
}

const PRESENTATION_FOLDERS = [
  "components",
  "ui",
  "views",
  "templates",
];

const APPLICATION_FOLDERS = [
  "app",
  "pages",
  "routes",
  "controllers",
  "api",
];

const BUSINESS_FOLDERS = [
  "services",
  "domain",
  "usecases",
  "use-cases",
  "lib",
  "utils",
];

const DATA_FOLDERS = [
  "repositories",
  "repository",
  "models",
  "dao",
  "database",
  "db",
  "prisma",
];

export function analyzeLayerSeparation(
  structure: ProjectStructure
): LayerAnalysis {
  let score = 0;
  const findings: string[] = [];

  const hasPresentationLayer = PRESENTATION_FOLDERS.some((folder) =>
    structure.folders.includes(folder)
  );

  const hasApplicationLayer = APPLICATION_FOLDERS.some((folder) =>
    structure.folders.includes(folder)
  );

  const hasBusinessLayer = BUSINESS_FOLDERS.some((folder) =>
    structure.folders.includes(folder)
  );

  const hasDataLayer = DATA_FOLDERS.some((folder) =>
    structure.folders.includes(folder)
  );

  if (hasPresentationLayer) {
    score += 20;
    findings.push("A separate presentation layer is present.");
  }

  if (hasApplicationLayer) {
    score += 20;
    findings.push("A separate application layer is present.");
  }

  if (hasBusinessLayer) {
    score += 20;
    findings.push("A separate business or shared logic layer is present.");
  }

  if (hasDataLayer) {
    score += 20;
    findings.push("A separate data-access layer is present.");
  }

  const detectedLayers = [
    hasPresentationLayer,
    hasApplicationLayer,
    hasBusinessLayer,
    hasDataLayer,
  ].filter(Boolean).length;

  if (detectedLayers >= 3) {
    score += 20;
    findings.push(
      "Multiple architectural responsibilities are separated into distinct layers."
    );
  } else if (detectedLayers === 2) {
    findings.push(
      "Some architectural responsibilities are separated, but additional layers may be beneficial."
    );
  } else if (detectedLayers <= 1) {
    findings.push(
      "Clear architectural layer separation could not be established from the project structure."
    );
  }

  return {
    score: Math.min(score, 100),
    findings,
  };
}