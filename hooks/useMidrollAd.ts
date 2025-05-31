import { useEffect, useState } from "react";

export const useMidrollAd = ({
  streamId,
  onTrigger,
  cooldown = 300, // seconds between ads
}: {
  streamId: string;
  onTrigger: () => void;
  cooldown?: number;
}) => {
  const [secondsWatched, setSecondsWatched] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsWatched((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsWatched > 0 && secondsWatched % cooldown === 0) {
      console.log("⏱️ Mid-roll triggered at", secondsWatched, "seconds");
      onTrigger(); // Play ad
    }
  }, [secondsWatched, cooldown, onTrigger]);
};
