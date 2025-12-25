import React, { useEffect, useRef, useState } from "react";
// Added missing import
import { motion } from "framer-motion";
// @ts-ignore
import textConfig from "../textConfig";

import music1 from "../music/music1.mp3";
import music2 from "../music/music2.mp3";
import music3 from "../music/music3.mp3";

// Updated paths to match your folder structure
import cover1 from "../musiccover/music1.jpg"; 
import cover2 from "../musiccover/music2.jpg";
import cover3 from "../musiccover/music3.jpg";

type Track = {
  id: number;
  title: string;
  caption: string;
  src: string;
  cover: string;
};

interface ChillZoneProps {
  onNext?: () => void;
}

// Global audio container logic
let globalAudioContainer: HTMLDivElement | null = null;
const getGlobalAudioContainer = () => {
  if (!globalAudioContainer) {
    globalAudioContainer = document.createElement('div');
    globalAudioContainer.id = 'persistent-audio-container';
    globalAudioContainer.style.display = 'none';
    document.body.appendChild(globalAudioContainer);
  }
  return globalAudioContainer;
};

export default function ChillZone({ onNext }: ChillZoneProps) {
  const tracks: Track[] = [
    { id: 1, title: textConfig.chillZone.tracks[0].title, caption: textConfig.chillZone.tracks[0].caption, src: music1, cover: cover1 },
    { id: 2, title: textConfig.chillZone.tracks[1].title, caption: textConfig.chillZone.tracks[1].caption, src: music2, cover: cover2 },
    { id: 3, title: textConfig.chillZone.tracks[2].title, caption: textConfig.chillZone.tracks[2].caption, src: music3, cover: cover3 },
  ];

  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = getGlobalAudioContainer();
    
    audioRefs.current = tracks.map((track) => {
      let audio = container.querySelector(`audio[data-track-id="${track.id}"]`) as HTMLAudioElement;
      if (!audio) {
        audio = document.createElement('audio');
        audio.src = track.src;
        audio.preload = 'metadata';
        audio.setAttribute('data-track-id', track.id.toString());
        container.appendChild(audio);
      }
      return audio;
    });

    audioRefs.current.forEach((audio, index) => {
      if (audio && !audio.paused) {
        setActiveIndex(index);
        setIsPlaying(true);
        setDuration(audio.duration || 0);
      }
    });
  }, []);

  const togglePlay = async (index: number) => {
    const currentAudio = audioRefs.current[index];
    if (!currentAudio) return;

    if (activeIndex === index) {
      if (currentAudio.paused) {
        await currentAudio.play();
        setIsPlaying(true);
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
      return;
    }

    audioRefs.current.forEach((a, i) => {
      if (a && i !== index) {
        a.pause();
        a.currentTime = 0;
      }
    });

    setActiveIndex(index);
    setIsPlaying(true);
    try {
      await currentAudio.play();
    } catch (err) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const idx = activeIndex;
    if (idx == null) return;
    const audio = audioRefs.current[idx];
    if (!audio) return;

    // Fix for 0:00 Duration: Update whenever metadata or duration changes
    const updateMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); setActiveIndex(null); };

    if (audio.readyState >= 1) setDuration(audio.duration);

    audio.addEventListener("loadedmetadata", updateMetadata);
    audio.addEventListener("durationchange", updateMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    
    return () => {
      audio.removeEventListener("loadedmetadata", updateMetadata);
      audio.removeEventListener("durationchange", updateMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [activeIndex]);

  const formatTime = (s: number) => {
    if (isNaN(s) || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const secs = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${secs}`;
  };

  return (
    <main className="flex-grow relative w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-retro-yellow rounded-full opacity-40 animate-float" />
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-retro-pink rounded-full opacity-30 animate-float-slow" />

      {/* Header Section */}
      <div className="text-center mb-12 relative z-10">
        <span className="block text-retro-pink font-hand text-2xl rotate-[-2deg] mb-2">
          {textConfig.chillZone.subheading}
        </span>
        <h1 className="text-4xl md:text-6xl font-display text-primary drop-shadow-sm tracking-tight leading-tight">
          {textConfig.chillZone.heading}
        </h1>
      </div>

      <div className="w-full flex flex-col gap-6 md:gap-8 z-10">
        {tracks.map((track, index) => {
          const active = activeIndex === index;
          const isActuallyPlaying = active && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => togglePlay(index)}
              className={`group relative flex flex-col md:flex-row items-stretch bg-white rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer border-b-8 border-r-8 shadow-xl ${
                active 
                ? "scale-[1.03] border-primary z-20" 
                : "hover:scale-[1.01] border-gray-200 grayscale-[0.3] hover:grayscale-0"
              }`}
            >
              {/* ALBUM COVER */}
              <div className="w-full md:w-56 h-56 relative shrink-0 overflow-hidden bg-gray-100">
                <img 
                  src={track.cover} 
                  alt={track.title}
                  className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isActuallyPlaying ? 'scale-125 rotate-3' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform transition-all duration-300 ${active ? 'scale-110' : 'opacity-0 group-hover:opacity-100 scale-100'}`}>
                    <span className="material-icons-round text-primary text-3xl">
                      {isActuallyPlaying ? "pause" : "play_arrow"}
                    </span>
                  </div>
                </div>
              </div>

              {/* TAPE REEL MECHANISM */}
              <div className={`flex-grow p-6 md:p-8 flex flex-col justify-between relative transition-colors duration-500 ${active ? 'bg-note-yellow/40' : 'bg-white'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-4">
                    <h2 className="text-2xl md:text-3xl font-display text-primary leading-tight mb-1">
                      {track.title}
                    </h2>
                    <p className="text-retro-pink font-semibold tracking-wide uppercase text-xs md:text-sm">
                      {track.caption}
                    </p>
                  </div>
                  {/* Timer Display */}
                  <div className="bg-gray-800 px-3 py-1 rounded text-[#00FF41] font-mono text-xs md:text-sm shadow-inner min-w-[100px] text-center border-2 border-gray-600">
                    {active ? formatTime(currentTime) : "0:00"} / {active ? formatTime(duration) : "0:00"}
                  </div>
                </div>

                {/* Animated Reels */}
                <div className="flex items-center justify-between gap-4 md:gap-10 py-2">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-gray-300 relative flex items-center justify-center shadow-inner bg-white/50 ${isActuallyPlaying ? 'animate-spin-slow' : ''}`}>
                    <div className="w-[2px] h-full bg-gray-300 absolute" />
                    <div className="h-[2px] w-full bg-gray-300 absolute" />
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 z-10 shadow-sm" />
                  </div>
                  
                  {/* Tape Progress Bar */}
                  <div className="flex-grow h-4 bg-gray-200 rounded-full relative overflow-hidden shadow-inner border border-gray-300">
                     <motion.div 
                        className="absolute inset-0 bg-primary opacity-40"
                        initial={{ width: 0 }}
                        animate={{ width: active && duration > 0 ? `${(currentTime / duration) * 100}%` : 0 }}
                        transition={{ ease: "linear", duration: 0.1 }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <span className="text-[8px] md:text-[10px] font-black tracking-[0.5em] md:tracking-[1em]">MAGNETIC TAPE</span>
                     </div>
                  </div>

                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-gray-300 relative flex items-center justify-center shadow-inner bg-white/50 ${isActuallyPlaying ? 'animate-spin-slow' : ''}`}>
                    <div className="w-[2px] h-full bg-gray-300 absolute" />
                    <div className="h-[2px] w-full bg-gray-300 absolute" />
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 z-10 shadow-sm" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-4 opacity-10 font-display text-2xl md:text-4xl select-none italic text-primary">
                  REEL TO REEL
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
        >
          {textConfig.chillZone.continueButton}
          <span className="material-icons-round">arrow_forward</span>
        </button>
      </div>

      <style>{`
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 5s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}