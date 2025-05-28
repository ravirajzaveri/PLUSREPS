"use client";

import { useEffect, useState } from "react";
import { ResultCard, ResultCardSkeleton } from "@/app/(browse)/(home)/_components/result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";

interface StreamData {
  id: string;
  username: string;
  imageUrl: string;
  isLive: boolean;
  title: string;
  thumbnail: string | null;
}


export const FollowingView = () => {
  const [data, setData] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch("/api/following-streams", {
          credentials: "include", // ✅ Send Clerk session cookies
        });
        const json = await res.json();
        console.log("📦 Fetched streams from API:", json);

        setData(
  json.sort((a: { isLive: boolean }, b: { isLive: boolean }) => {
    if (a.isLive === b.isLive) return 0;
    return a.isLive ? -1 : 1;
  })
);



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
      <div>
        <Skeleton className="h-8 w-[290px] mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[...Array(4)].map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="text-muted-foreground text-sm">No followed streams are live.</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Followed Streams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 px-2 sm:px-0">
        {data.map((stream) => (
          <ResultCard
            key={stream.id}
            data={{
              user: {
                id: stream.id,
                username: stream.username,
                imageUrl: stream.imageUrl,
              },
              isLive: stream.isLive,
              title: stream.title,
              thumbnail: stream.thumbnail,
            }}
          />
        ))}

      </div>
    </div>
  );
};
