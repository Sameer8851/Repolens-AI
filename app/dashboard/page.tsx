import { syncUser } from "@/actions/user";
import { ConnectGitHubButton } from "@/components/github/connect-github-button";

export default async function DashboardPage() {
  const user = await syncUser();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {user?.username}
      </h1>

      <div className="mt-6">
        <ConnectGitHubButton />
      </div>

      <pre className="mt-6 rounded bg-gray-100 p-4">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}