import { createHash } from "crypto";
import { AnalysisResult } from "./types";

export function createAnalysisHash(
  analysis: AnalysisResult,
): string {
  const data = JSON.stringify(analysis);

  return createHash("sha256")
    .update(data)
    .digest("hex");
}