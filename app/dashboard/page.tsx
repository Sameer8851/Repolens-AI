import { syncUser } from "@/actions/user";
import { ConnectGitHubButton } from "@/components/github/connect-github-button";
import { syncRepositories } from "@/actions/repository";
import { getDashboardRepositories } from "@/actions/dashboard";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";

export default async function DashboardPage() {
  const user = await syncUser();
  const repositories = await getDashboardRepositories();
  await syncRepositories();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {user?.username}
      </h1>

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