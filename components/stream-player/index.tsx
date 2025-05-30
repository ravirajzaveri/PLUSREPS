"use client";

import { LiveKitRoom } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { Video } from "./video";
import { VideoSkeleton } from "./video";
import { Header } from "./header";
import { HeaderSkeleton } from "./header";
import { Chat } from "./chat";
import { ChatSkeleton } from "./chat";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { ChatToggle } from "./chat-toggle";

type CustomStream = {
  id: string;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  isLive: boolean;
  thumbnail: string | null;
  title: string;
};

type CustomUser = {
  id: string;
  username: string;
  bio: string | null;
  stream: CustomStream | null;
  imageUrl: string;
  _count: { followedBy: number };
};

interface StreamPlayerProps {
  user: CustomUser;
  stream: CustomStream;
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);
  const { collapsed } = useChatSidebar((s) => s);

  if (!token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-4 z-50">
          <ChatToggle />
        </div>
      )}

      {/* full-screen flex container */}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!}
        className="relative flex h-screen w-full"
      >
        {/* ─── Mobile ─── */}
        <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
          <div className="flex-shrink-0">
            <Video hostName={user.username} hostIdentity={user.id} />
          </div>
          <div className="flex-shrink-0 px-3 py-2">
            <Header
              hostName={user.username}
              hostIdentity={user.id}
              viewerIdentity={identity}
              imageUrl={user.imageUrl}
              isFollowing={isFollowing}
              name={stream.title}
            />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <Chat
              viewerName={name}
              hostName={user.username}
              hostIdentity={user.id}
              isFollowing={isFollowing}
              isChatEnabled={stream.isChatEnabled}
              isChatDelayed={stream.isChatDelayed}
              isChatFollowersOnly={stream.isChatFollowersOnly}
            />
          </div>
        </div>

        {/* ─── Desktop ─── */}
        <div className="hidden lg:flex flex-1 overflow-hidden pr-[320px]">
          {/* Left: Video + Info */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-shrink-0">
              <Video hostName={user.username} hostIdentity={user.id} />
            </div>
            <div className="flex-shrink-0">
              <Header
                hostName={user.username}
                hostIdentity={user.id}
                viewerIdentity={identity}
                imageUrl={user.imageUrl}
                isFollowing={isFollowing}
                name={stream.title}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              <InfoCard
                hostIdentity={user.id}
                viewerIdentity={identity}
                name={stream.title}
                thumbnailUrl={stream.thumbnail}
              />
              <AboutCard
                hostName={user.username}
                hostIdentity={user.id}
                viewerIdentity={identity}
                bio={user.bio}
                followedByCount={user._count.followedBy}
              />
            </div>
          </div>
        </div>

        {/* Right: Fixed Chat */}
        {!collapsed && (
          <div className="hidden lg:flex fixed right-0 top-0 h-screen w-[320px] border-l bg-background z-40 flex-col overflow-hidden">
            <Chat
              viewerName={name}
              hostName={user.username}
              hostIdentity={user.id}
              isFollowing={isFollowing}
              isChatEnabled={stream.isChatEnabled}
              isChatDelayed={stream.isChatDelayed}
              isChatFollowersOnly={stream.isChatFollowersOnly}
            />
          </div>
        )}
      </LiveKitRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => (
  <div className="relative h-screen">
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full pr-[320px]">
      <div className="col-span-2 space-y-4 overflow-y-auto p-4">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
    </div>
    <div className="hidden lg:block fixed right-0 top-0 h-screen w-[320px] bg-background z-40">
      <ChatSkeleton />
    </div>
  </div>
);
