"use client";

import { Suspense, useState } from "react";

import { Results, ResultsSkeleton } from "./_components/results";
import { LiveReelsView } from "./_components/live-reels-view";
import { HomeTabs } from "./_components/home-tabs";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"Following" | "Live">("Following");

  return (
    <div className="h-full flex flex-col">
      <HomeTabs onTabChange={setActiveTab} activeTab={activeTab} />

      <div className="flex-1 overflow-y-auto px-4 pt-2">
        {activeTab === "Following" ? (
          <Suspense fallback={<ResultsSkeleton />}>
            <Results />
          </Suspense>
        ) : (
          <LiveReelsView />
        )}
      </div>
    </div>
  );
}

