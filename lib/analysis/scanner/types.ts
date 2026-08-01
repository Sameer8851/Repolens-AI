export interface ScannedFile {
  path: string;
  name: string;
  extension: string;
  size: number;
  language?: string;
  lineCount: number;
}

export interface ScanResult {
  repositoryPath: string;
  files: ScannedFile[];
}