"use client";

export function ConnectGitHubButton() {
  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

    const redirectUri = encodeURIComponent(
  `${process.env.NEXT_PUBLIC_APP_URL}/api/github/callback`
    );

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=repo read:user`;
  };

  return (
    <button
      onClick={handleConnect}
      className="rounded bg-black px-4 py-2 text-white"
    >
      Connect GitHub
    </button>
  );
}