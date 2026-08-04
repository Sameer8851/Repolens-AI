import { ScannedFile } from "../scanner/types";




export interface ProjectStructure {
  folders: string[];
}
const IMPORTANT_FOLDERS = [
  "app",
  "pages",
  "src",
  "components",
  "hooks",
  "actions",
  "lib",
  "utils",
  "api",
  "prisma",
  "public",
  "tests",
];


export function analyzeProjectStructure(
  files: ScannedFile[],
): ProjectStructure {
  const detectedFolders = new Set<string>();

  for (const file of files) {
    const parts = file.path.split(/[\\/]/);

    if (parts.length > 1) {
      const topLevelFolder = parts[0];

      if (IMPORTANT_FOLDERS.includes(topLevelFolder)) {
        detectedFolders.add(topLevelFolder);
      }
    }
  }

  return {
    folders: [...detectedFolders].sort(),
  };
}