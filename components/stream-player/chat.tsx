"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectionState } from "livekit-client";
import { useMediaQuery } from "usehooks-ts";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatCommunity } from "./chat-community";

interface ChatProps {
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}

export const Chat = ({
  hostName,
  hostIdentity,
  viewerName,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
}: ChatProps) => {
  const matches = useMediaQuery("(max-width: 1024px)");
  const { variant, onExpand } = useChatSidebar((s) => s);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;
  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();

  useEffect(() => {
    if (matches) onExpand();
  }, [matches, onExpand]);

  const reversed = useMemo(
    () => [...messages].sort((a, b) => b.timestamp - a.timestamp),
    [messages]
  );

  const onSubmit = () => {
    if (!send) return;
    send(value);
    setValue("");
  };

  const onChange = (v: string) => setValue(v);

  return (
    <div className="flex flex-col h-full bg-background lg:overscroll-auto overscroll-contain">
      <ChatHeader />

      {variant === ChatVariant.CHAT && (
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* messages */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2">
            <ChatList messages={reversed} isHidden={isHidden} />
          </div>

          {/* input */}
          <div className="flex-shrink-0 border-t bg-background px-3 py-2">
            <ChatForm
              onSubmit={onSubmit}
              value={value}
              onChange={onChange}
              isHidden={isHidden}
              isFollowersOnly={isChatFollowersOnly}
              isDelayed={isChatDelayed}
              isFollowing={isFollowing}
            />
          </div>
        </div>
      )}

      {variant === ChatVariant.COMMUNITY && (
        <ChatCommunity
          viewerName={viewerName}
          hostName={hostName}
          isHidden={isHidden}
        />
      )}
    </div>
  );
};

export const ChatSkeleton = () => (
  <div className="flex flex-col h-full border-l border-b bg-background">
    <ChatHeaderSkeleton />
    <div className="flex-1 min-h-0 overflow-y-auto">
      <ChatListSkeleton />
    </div>
    <div className="flex-shrink-0 border-t px-3 py-2">
      <ChatFormSkeleton />
    </div>
  </div>
);


