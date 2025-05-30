"use client";

import { Stream, User } from "@prisma/client";
import { LiveKitRoom } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { ChatToggle } from "./chat-toggle";
import { Chat, ChatSkeleton } from "./chat";
import { Video, VideoSkeleton } from "./video";
import { Header, HeaderSkeleton } from "./header";

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
  const { collapsed } = useChatSidebar((state) => state);

  if (!token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!}
        className="h-[100dvh] w-full"
      >
        {/* ✅ Mobile */}
        <div className="lg:hidden flex flex-col h-full overflow-hidden">
          <div className="shrink-0">
            <Video hostName={user.username} hostIdentity={user.id} />
          </div>
          <div className="px-3 py-2">
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

        {/* ✅ Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 w-full h-[100dvh] overflow-hidden">
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 flex flex-col overflow-y-auto min-h-[100dvh] pb-20">
            <Video hostName={user.username} hostIdentity={user.id} />
            <Header
              hostName={user.username}
              hostIdentity={user.id}
              viewerIdentity={identity}
              imageUrl={user.imageUrl}
              isFollowing={isFollowing}
              name={stream.title}
            />
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

          <div className={cn("col-span-1 bg-background flex flex-col h-[100dvh]", collapsed && "hidden")}>
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
      </LiveKitRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
};
