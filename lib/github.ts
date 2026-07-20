import { Octokit } from "octokit";

export function createGitHubClient(token: string) {
    return new Octokit({
        auth: token,
    });
}

export async function getRepositories(token: string) {
    const github = createGitHubClient(token);

    const { data } = await github.request("GET /user/repos", {
        sorting: "updated",
        per_page: 100,
    });
    return data;
}