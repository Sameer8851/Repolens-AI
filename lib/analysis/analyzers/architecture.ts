import { ProjectStructure } from "./project-structure";


export interface ArchitectureAnalysis {
  architecture: string;
  confidence: number;
}


export function analyzeArchitecture(
  structure: ProjectStructure,
): ArchitectureAnalysis {
  const folders = structure.folders;

  if (folders.includes("app")) {
    return {
      architecture: "Next.js App Router",
      confidence: 100,
    };
  }

  if (folders.includes("pages")) {
    return {
      architecture: "Next.js Pages Router",
      confidence: 100,
    };
  }

  if (
    folders.includes("src") &&
    folders.includes("components") &&
    folders.includes("hooks")
  ) {
    return {
      architecture: "Feature-Based",
      confidence: 90,
    };
  }

  return {
    architecture: "Unknown",
    confidence: 50,
  };
}