import { syncUser } from "@/actions/user";
import { ConnectGitHubButton } from "@/components/github/connect-github-button";
import { getDashboardRepositories } from "@/actions/dashboard";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { SyncRepositoriesButton } from "@/components/dashboard/SyncRepositoriesButton";

export default async function DashboardPage() {
  const user = await syncUser();
  const repositories = await getDashboardRepositories();

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome {user?.username}
        </h1>

        <SyncRepositoriesButton />
      </div>

      <div className="mt-6">
        {!user?.githubAccessToken && <ConnectGitHubButton />}
      </div>

      <div className="mt-8 space-y-6">
        {repositories.map((repository) => (
          <RepositoryCard
            key={repository.id}
            repository={repository}
          />
        ))}
      </div>
    </div>
  );
}