"use client";

import { useEffect, useState, useRef } from "react";
import { Follow, User } from "@prisma/client";
import Hls from "hls.js";
import { useInView } from "react-intersection-observer";

// Define the shape of each followed live stream entry
interface LiveStream {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  updatedAt: string;
  following: User & {
    stream: {
      isLive: boolean;
      title: string | null;
      thumbnail: string | null;
      playbackUrl: string | null;
    } | null;
  };
}

// Main Reels-view component: fetches and displays live streams in a vertical swipeable feed
export const LiveReelsView = () => {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      console.log("🎥 Fetching live streams...");
      try {
        const res = await fetch("/api/following-streams", { credentials: "include" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: LiveStream[] = await res.json();
        // Filter only live streams
        const live = data.filter(item => item.following.stream?.isLive);
        console.log(`🎥 Found ${live.length} live streams`);
        setStreams(live);
      } catch (error) {
        console.error("❌ Failed fetching live streams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!streams.length) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        No live streams
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {streams.map(stream => (
        <ReelItem key={stream.followingId} stream={stream} />
      ))}
    </div>
  );
};

// Single reel item: handles auto-play/pause when in view
interface ReelItemProps {
  stream: LiveStream;
}

const ReelItem: React.FC<ReelItemProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0.8 });

  // Initialize HLS.js or native playback
  useEffect(() => {
    const video = videoRef.current;
    const url = stream.following.stream?.playbackUrl;
    if (!video || !url) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }
  }, [stream.following.stream?.playbackUrl]);

  // Auto play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="snap-start h-screen w-full bg-black flex items-center justify-center relative"
    >
      <video
        ref={videoRef}
        className="object-contain h-full w-full"
        muted
        playsInline
        loop
      />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="font-semibold">@{stream.following.username}</p>
        {stream.following.stream?.title && (
          <p className="text-sm">{stream.following.stream.title}</p>
        )}
      </div>
    </div>
  );
};


