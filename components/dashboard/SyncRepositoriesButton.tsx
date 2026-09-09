"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncRepositories } from "@/actions/repository";

export function SyncRepositoriesButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    setProgress(10);

    try {
      setProgress(30);

      await syncRepositories();

      setProgress(100);

      router.refresh();
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSyncing ? "Syncing..." : "Sync Repositories"}
      </button>

      {isSyncing && (
        <div className="w-64">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {progress}% complete
          </p>
        </div>
      )}
    </div>
  );
}