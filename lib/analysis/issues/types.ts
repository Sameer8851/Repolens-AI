export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH";

export interface RepositoryIssue {
  type: string;
  category: string;

  severity: IssueSeverity;

  message: string;

  filePath?: string;
  lineNumber?: number;
}