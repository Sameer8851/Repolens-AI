import { getDashboardRepositories } from "@/actions/dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type RepositoryCardProps = {
  repository: Awaited<
    ReturnType<typeof getDashboardRepositories>
  >[number];
};

function getDifficultyVariant(
  difficulty: string | null | undefined
) {
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

export function RepositoryCard({
  repository,
}: RepositoryCardProps) {
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
              className={getDifficultyVariant(
                repository.analysis.difficulty
              )}
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
          <h3 className="mb-2 font-semibold">
            AI Summary
          </h3>

          <p className="text-sm text-muted-foreground">
            {repository.analysis?.summary ??
              "No AI analysis available."}
          </p>
        </div>

        {/* Tech Stack */}
        {repository.analysis?.techStack &&
          repository.analysis.techStack.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">
                Tech Stack
              </h3>

              <div className="flex flex-wrap gap-2">
                {repository.analysis.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Architecture */}
        {repository.analysis?.architecture && (
          <div>
            <h3 className="mb-2 font-semibold">
              Architecture
            </h3>

            <p className="text-sm text-muted-foreground">
              {repository.analysis.architecture}
            </p>
          </div>
        )}

        {/* Suggestions */}
        {repository.analysis?.suggestions &&
          repository.analysis.suggestions.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">
                Suggestions
              </h3>

              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {repository.analysis.suggestions.map(
                  (suggestion) => (
                    <li key={suggestion}>
                      {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

        {/* Footer */}
        <div className="pt-2">
          <Button asChild className="w-full">
            <Link
              href={repository.htmlUrl}
              target="_blank"
            >
              View on GitHub
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}