"use client";

import { useEffect, useState } from "react";
import { Follow, User } from "@prisma/client";
import { ResultCard, ResultCardSkeleton } from "@/app/(browse)/(home)/_components/result-card";

// 👇 Define expected shape for each followed user entry
interface FollowingProps {
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

export const FollowingView = () => {
  const [data, setData] = useState<FollowingProps["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      console.log("Fetching /api/following-streams...");
      try {
        const res = await fetch("/api/following-streams");

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const json = await res.json();
        console.log("✅ Received data:", json);

        setData(json);
      } catch (error) {
        console.error("❌ Error fetching followed streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  if (loading) {
    console.log("🔄 Loading...");
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {[...Array(6)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data.length) {
    console.log("⚠️ No followed streams found.");
    return null;
  }

  // Filter out non-live users before rendering
  const liveFollowings = data.filter(f => f.following.stream?.isLive);

  if (!liveFollowings.length) {
    console.log("ℹ️ All followed users are offline.");
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {liveFollowings.map((follow) => (
        <ResultCard
          key={follow.following.id}
          data={{
            user: follow.following,
            isLive: true,
            title: follow.following.stream?.title || "Untitled Stream",
            thumbnail: follow.following.stream?.thumbnail,
          }}
        />
      ))}
    </div>
  );
};
