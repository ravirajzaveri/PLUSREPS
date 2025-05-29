"use client";

import { useEffect, useState } from "react";
import { Follow, User } from "@prisma/client";
import { StreamCard } from "@/components/stream-card"; // this is your wide style card

interface FollowingProps {
  data: (Follow & {
    following: User & {
      stream: {
        isLive: boolean;
        thumbnail: string | null;
        title: string | null;
      } | null;
    };
  })[];
}

export const FollowingView = () => {
  const [data, setData] = useState<FollowingProps["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch("/api/following-streams");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching followed streams", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-video bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {data
        .filter(f => f.following.stream?.isLive)
        .map(follow => (
          <StreamCard
            key={follow.following.id}
            user={follow.following}
            stream={follow.following.stream!}
          />
        ))}
    </div>
  );
};
