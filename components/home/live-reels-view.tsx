"use client";

import { useEffect, useState } from "react";
import { Follow, User } from "@prisma/client";
import { ResultCard, ResultCardSkeleton } from "@/app/(browse)/(home)/_components/result-card";

interface LiveProps {
  data: (Follow & {
    following: User & {
      stream: {
        isLive: boolean;
        title: string | null;
        thumbnail: string | null;
      } | null;
    };
  })[];
}

export const LiveReelsView = () => {
  const [data, setData] = useState<LiveProps["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      console.log("🎥 [Live] Fetching /api/following-streams...");
      try {
        const res = await fetch("/api/following-streams", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const json = await res.json();
        console.log("🎥 [Live] Received:", json);

        setData(json);
      } catch (error) {
        console.error("❌ [Live] Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
  }, []);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {[...Array(6)].map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      </div>

    );
  }

  const liveUsers = data.filter(f => f.following.stream?.isLive);

  if (!liveUsers.length) {
    console.log("📭 [Live] No users live right now.");
    return (
      <div className="text-muted-foreground text-sm mt-4">No one is live right now.</div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {liveUsers.map((follow) => (
          <ResultCard
            key={follow.following.id}
            data={{
              user: follow.following,
              isLive: true,
              title: follow.following.stream?.title || "Untitled Stream",
              thumbnail: follow.following.stream?.thumbnail ?? null,
            }}
          />
        ))}
      </div>
    </div>

  );
};

