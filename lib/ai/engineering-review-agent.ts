import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

import {
  engineeringReviewSchema,
  EngineeringReview,
} from "./engineering-review";

import { EngineeringContext } from "./context";

export async function generateEngineeringReview(
  context: EngineeringContext,
): Promise<EngineeringReview> {
  const { object } = await generateObject({
    model: google("gemini-flash-latest"),

    schema: engineeringReviewSchema,

    prompt: `
You are a senior software engineer performing
an engineering review of a software repository.

Analyze ONLY the repository information provided below.

Do not invent files, technologies, architecture,
issues, or behavior that is not supported by the data.

Repository:
${JSON.stringify(context.repository, null, 2)}

Languages:
${JSON.stringify(context.languages, null, 2)}

Frameworks:
${JSON.stringify(context.frameworks, null, 2)}

Dependencies:
${JSON.stringify(context.dependencies, null, 2)}

Project Structure:
${JSON.stringify(context.structure, null, 2)}

Architecture:
${JSON.stringify(context.architecture, null, 2)}

Metrics:
${JSON.stringify(context.metrics, null, 2)}

Code Metrics:
${JSON.stringify(context.codeMetrics, null, 2)}

Health:
${JSON.stringify(context.health, null, 2)}

Detected Issues:
${JSON.stringify(context.issues, null, 2)}

Provide an engineering review containing:

1. Executive summary
2. Architecture review
3. Engineering strengths
4. Important risks
5. Actionable recommendations

Base every conclusion on the supplied repository evidence.
`,
  });

  return object;
}
