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

// Single reel item: handles auto-play/pause when in view, with size constraints
interface ReelItemProps {
  stream: LiveStream;
}

const ReelItem: React.FC<ReelItemProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0.8 });

  // Setup HLS or native playback, handle errors, and play on manifest or metadata
  useEffect(() => {
    const video = videoRef.current;
    const url = stream.following.stream?.playbackUrl;

    console.log("🔗 Playback URL", stream.following.stream?.playbackUrl);

    let hls: Hls | null = null;

    if (!video || !url) return;
    console.log("🔗 Setting up HLS for", url);

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("📜 Manifest parsed, ready to play");
        video.load();
        if (inView) video.play().catch(err => console.error("Play error:", err));
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        console.log("📜 Metadata loaded, ready to play");
        video.load();
        if (inView) video.play().catch(err => console.error("Play error:", err));
      });
    }

    // Cleanup HLS instance on unmount
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [stream.following.stream?.playbackUrl, inView]);

  // Auto play/pause when visibility changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      console.log("▶️ In view, playing video");
      video.play().catch(err => console.error("Play error:", err));
    } else {
      console.log("⏸️ Out of view, pausing video");
      video.pause();
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="snap-start w-full bg-black flex items-center justify-center relative h-screen md:h-[80vh]"
    >
      <div className="w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="object-contain w-full h-full max-w-full md:max-w-2xl"
          muted
          playsInline
          loop
          onError={e => console.error('Video element error', e)}
        />
      </div>
      <div className="absolute bottom-4 left-4 text-white max-w-full md:max-w-2xl">
        <p className="font-semibold">@{stream.following.username}</p>
        {stream.following.stream?.title && (
          <p className="text-sm truncate md:truncate-none">
            {stream.following.stream.title}
          </p>
        )}
      </div>
    </div>
  );
};

