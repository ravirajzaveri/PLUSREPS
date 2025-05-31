"use client";

import { useEffect, useState } from "react";

export const AdPlayer = ({ streamId, onComplete }: { streamId: string; onComplete: () => void }) => {
  const [ad, setAd] = useState<any>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      const res = await fetch("/api/ads/playable", {
        method: "POST",
        body: JSON.stringify({ streamId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setAd(data.ad || null);
    };

    loadAd();
  }, [streamId]);

  const handleComplete = async () => {
    if (!ad) return onComplete();
    if (ad.id !== "fallback") {
    await fetch("/api/ads/viewed", {
      method: "POST",
      body: JSON.stringify({
        adId: ad.id,
        streamId,
        skipped,
      }),
      headers: { "Content-Type": "application/json" },
    });
    } else {
    console.log("🌀 Skipped logging fallback ad");
    }
    onComplete();
  };

  if (!ad) return onComplete();

  return (
    <div className="w-full h-[200px] bg-black flex flex-col items-center justify-center text-white">
      <video
        src={ad.videoUrl}
        className="w-full"
        autoPlay
        muted
        controls={false}
        onEnded={handleComplete}
      />
      {ad.isSkippable && (
        <button
          onClick={() => {
            setSkipped(true);
            handleComplete();
          }}
          className="absolute bottom-3 right-4 bg-gray-700 px-3 py-1 rounded"
        >
          Skip
        </button>
      )}
    </div>
  );
};
