import { buildEngineeringContext } from "./context";
import { generateEngineeringReview } from "./engineering-review-agent";
import { AnalysisResult } from "@/lib/analysis/types";

interface RepositoryMetadata {
  name: string;
  description: string | null;
  language: string | null;
}

export async function runEngineeringReview(
  repository: RepositoryMetadata,
  analysis: AnalysisResult,
) {
  const context = buildEngineeringContext(
    repository,
    analysis,
  );

  return generateEngineeringReview(context);
}