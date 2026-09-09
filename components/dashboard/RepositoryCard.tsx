import { getDashboardRepositories } from "@/actions/dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type RepositoryCardProps = {
  repository: Awaited<ReturnType<typeof getDashboardRepositories>>[number];
};
type EngineeringRisk = {
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

type EngineeringRecommendation = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

function getDifficultyVariant(difficulty: string | null | undefined) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-700 hover:bg-green-100";

    case "Intermediate":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";

    case "Advanced":
      return "bg-red-100 text-red-700 hover:bg-red-100";

    default:
      return "";
  }
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const strengths = Array.isArray(repository.engineeringReview?.strengths)
    ? repository.engineeringReview.strengths.filter(
        (strength): strength is string => typeof strength === "string",
      )
    : [];

  const risks = Array.isArray(repository.engineeringReview?.risks)
    ? (repository.engineeringReview.risks as unknown as EngineeringRisk[])
    : [];

  const recommendations = Array.isArray(
    repository.engineeringReview?.recommendations,
  )
    ? (repository.engineeringReview
        .recommendations as unknown as EngineeringRecommendation[])
    : [];
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{repository.name}</CardTitle>

            <CardDescription className="mt-1">
              {repository.language ?? "Unknown Language"}
            </CardDescription>
          </div>

          {repository.analysis?.difficulty && (
            <Badge
              className={getDifficultyVariant(repository.analysis.difficulty)}
            >
              {repository.analysis.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Repository Stats */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>⭐ {repository.stargazersCount}</span>
          <span>🍴 {repository.forksCount}</span>
        </div>

        {/* AI Summary */}
        <div>
          <h3 className="mb-2 font-semibold">AI Summary</h3>

          <p className="text-sm text-muted-foreground">
            {repository.analysis?.summary ?? "No AI analysis available."}
          </p>
        </div>

        {/* Engineering Review */}
        {repository.engineeringReview && (
          <div>
            <h3 className="mb-2 font-semibold">Engineering Review</h3>

            <p className="text-sm text-muted-foreground">
              {repository.engineeringReview.executiveSummary}
            </p>
          </div>
        )}

        {strengths.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold">Engineering Strengths</h3>

            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {risks.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold">Risks</h3>

            <ul className="space-y-2 text-sm">
              {risks.map((risk) => (
                <li key={risk.title}>
                  <span className="font-medium">{risk.title}</span>
                  <p className="text-muted-foreground">{risk.description}</p>
                  <Badge variant="outline">{risk.severity}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold">Recommendations</h3>

            <ul className="space-y-2 text-sm">
              {recommendations.map((recommendation) => (
                <li key={recommendation.title}>
                  <span className="font-medium">{recommendation.title}</span>

                  <p className="text-muted-foreground">
                    {recommendation.description}
                  </p>

                  <Badge variant="outline">{recommendation.priority}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {repository.analysis?.techStack &&
          repository.analysis.techStack.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Tech Stack</h3>

              <div className="flex flex-wrap gap-2">
                {repository.analysis.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Architecture */}
        {repository.analysis?.architecture && (
          <div>
            <h3 className="mb-2 font-semibold">Architecture</h3>

            <p className="text-sm text-muted-foreground">
              {repository.analysis.architecture}
            </p>
          </div>
        )}

        {/* Suggestions */}
        {repository.analysis?.suggestions &&
          repository.analysis.suggestions.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Suggestions</h3>

              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {repository.analysis.suggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

        {/* Footer */}
        <div className="pt-2">
          <Link
            href={repository.htmlUrl}
            target="_blank"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View on GitHub
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
