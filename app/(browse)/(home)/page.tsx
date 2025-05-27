"use client";

import { useState } from "react";
import { HomeTabs } from "@/components/home/home-tabs";
import { FollowingView } from "@/components/home/following-view";
import { LiveReelsView } from "@/components/home/live-reels-view";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Following");

  return (
    <>
      <HomeTabs onTabChange={setActiveTab} />
      {activeTab === "Following" ? <FollowingView /> : <LiveReelsView />}
    </>
  );
}
