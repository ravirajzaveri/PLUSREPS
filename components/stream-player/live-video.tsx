"use client";

import { useRef, useState, useEffect } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";
import { useEventListener } from "usehooks-ts";

import { VolumeControl } from "./volume-controle";
import { FullscreenControl } from "./fullscreen-control";

interface LiveVideoProps {
  participant: Participant;
}

export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showPreRoll, setShowPreRoll] = useState(true);

  // ✅ Always call hooks at top level
  const matchingTracks = useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity);

  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  const toggleMute = () => {
    const isMuted = volume === 0;
    setVolume(isMuted ? 50 : 0);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  useEffect(() => {
    onVolumeChange(50);
  }, []);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      wrapperRef.current?.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);

  useEffect(() => {
    if (!showPreRoll && videoRef.current) {
      videoRef.current.srcObject = null;
      matchingTracks.forEach((track) => {
        track.publication.track?.attach(videoRef.current!);
      });
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay after ad failed:", err);
        });
      }
    }
  }, [showPreRoll, matchingTracks]);

if (showPreRoll) {
  return (
    <div
      ref={wrapperRef}
      className="relative h-full flex items-center justify-center bg-black"
    >
      <video
        src="https://fitstream-vid-ads.b-cdn.net/SampleDymatizeAd(1).mp4"
        autoPlay
        controls
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        onEnded={() => setShowPreRoll(false)}
      />
      {/* Advertiser link overlay */}
      <a
        href="https://dymatize.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 z-10 bg-white/90 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-white"
      >
        Visit Advertiser
      </a>
    </div>
  );
}


  // 📡 Live stream player
  return (
    <div ref={wrapperRef} className="relative h-full flex">
      <video ref={videoRef} width="100%" />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
          <VolumeControl onChange={onVolumeChange} value={volume} onToggle={toggleMute} />
          <FullscreenControl isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
        </div>
      </div>
    </div>
  );
};
