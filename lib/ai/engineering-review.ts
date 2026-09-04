import { z } from "zod";

export const engineeringReviewSchema = z.object({
  executiveSummary: z.string(),

  architectureReview: z.string(),

  strengths: z.array(z.string()),

  risks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
      ]),
    }),
  ),

  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
      ]),
    }),
  ),
});

export type EngineeringReview = z.infer<
  typeof engineeringReviewSchema
>;