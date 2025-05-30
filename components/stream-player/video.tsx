"use client";

import { ConnectionState, Track } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";

import { Skeleton } from "@/components/ui/skeleton";
import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";

interface VideoProps {
  hostName: string;
  hostIdentity: string;
}

export const Video = ({ hostName, hostIdentity }: VideoProps) => {
  const conn = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]).filter(
    (t) => t.participant.identity === hostIdentity
  );

  let content;
  if (!participant && conn === ConnectionState.Connected) {
    content = <OfflineVideo username={hostName} />;
  } else if (!participant || tracks.length === 0) {
    content = <LoadingVideo label={conn} />;
  } else {
    content = <LiveVideo participant={participant} />;
  }

  return (
    <div className="relative w-full bg-black aspect-video z-0 md:rounded-xl md:overflow-hidden md:shadow-lg">
      {/* Back button for mobile */}
      <button
        onClick={() => (window.location.href = "/")}
        className="lg:hidden absolute top-6 left-2 z-20 bg-black/60 p-1 rounded-full backdrop-blur-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {content}
    </div>
  );
};

export const VideoSkeleton = () => (
  <div className="relative aspect-video z-0 border-x border-background md:rounded-xl md:shadow-md">
    <Skeleton className="h-full w-full rounded-none" />
  </div>
);
