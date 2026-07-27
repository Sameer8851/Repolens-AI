import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const RepositoryAnalysisSchema = z.object({
  summary: z.string(),

  techStack: z.array(z.string()),

  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),

  architecture: z.string(),

  suggestions: z.array(z.string()),
});

export async function analyzeRepository(readme: string) {
  const prompt = `
You are an expert software engineer.

Analyze the following GitHub repository README and return:

1. A concise summary.
2. Technologies used.
3. Difficulty level (Beginner, Intermediate, or Advanced).
4. Architecture type.
5. 3-5 improvement suggestions.

README:

${readme}
`;
  try {
    const { object } = await generateObject({
      model: google("gemini-flash-latest"),
      schema: RepositoryAnalysisSchema,

      system: `
You are an expert software engineer.
Always analyze GitHub repositories accurately.
Return only the requested information.
`,

      prompt,
    });
    return object;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to analyze repository");
  }
}
