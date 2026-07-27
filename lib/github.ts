import { Octokit } from "octokit";

export function createGitHubClient(token: string) {
    return new Octokit({
        auth: token,
    });
}

export async function getRepositories(token: string) {
    const github = createGitHubClient(token);

    const { data } = await github.request("GET /user/repos", {
        sort: "updated",
        per_page: 100,
    });
    return data;
}

export async function getRepositoryReadme(
  token: string,
  owner: string,
  repo: string
) {
  try {
    const github = createGitHubClient(token);

    const { data } = await github.request(
      "GET /repos/{owner}/{repo}/readme",
      {
        owner,
        repo,
      }
    );

    return data;
  } catch {
    return null;
  }
}