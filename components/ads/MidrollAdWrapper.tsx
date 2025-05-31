"use client";

import { useMidrollAd } from "@/hooks/useMidrollAd";
import { useState } from "react";
import { AdPlayer } from "./AdPlayer";

export const MidrollAdWrapper = ({ streamId, children }: { streamId: string; children: React.ReactNode }) => {
  const [showAd, setShowAd] = useState(false);

  useMidrollAd({
    streamId,
    cooldown: 180, // show ad every 3 mins
    onTrigger: () => setShowAd(true),
  });

  const handleAdComplete = () => {
    setShowAd(false);
  };

  return (
    <div className="relative">
      {children}
      {showAd && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <AdPlayer streamId={streamId} onComplete={handleAdComplete} />
        </div>
      )}
    </div>
  );
};
