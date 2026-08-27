import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Gauge,
  UserCheck,
  ChevronUp,
  ChevronDown,
  X
} from "lucide-react";
import { Reciter } from "../types";
import { getAyahAudioUrl, getSurahAudioUrl } from "../data/recitersData";
import { SURAHS_LIST } from "../data/surahsData";

interface AudioPlayerBarProps {
  currentPlaying: { surah: number; ayah: number } | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  reciters: Reciter[];
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  repeatTimes: number;
  onSetRepeatTimes: (times: number) => void;
  playbackSpeed: number;
  onSetPlaybackSpeed: (speed: number) => void;
  onAudioEnded: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentPlaying,
  isPlaying,
  onPlay,
  onPause,
  onNextAyah,
  onPrevAyah,
  reciters,
  selectedReciter,
  onSelectReciter,
  repeatTimes,
  onSetRepeatTimes,
  playbackSpeed,
  onSetPlaybackSpeed,
  onAudioEnded,
  audioRef
}) => {
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatCountRemaining, setRepeatCountRemaining] = useState(repeatTimes);

  const currentSurahMeta = currentPlaying
    ? SURAHS_LIST.find((s) => s.number === currentPlaying.surah)
    : null;

  // Sync repeat count
  useEffect(() => {
    setRepeatCountRemaining(repeatTimes);
  }, [currentPlaying?.ayah, currentPlaying?.surah, repeatTimes]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleAudioEnd = () => {
    if (repeatCountRemaining > 1) {
      setRepeatCountRemaining((prev) => prev - 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setRepeatCountRemaining(repeatTimes);
      onAudioEnded();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    onSetPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const cycleRepeat = () => {
    const options = [1, 3, 5, 999];
    const nextIdx = (options.indexOf(repeatTimes) + 1) % options.length;
    onSetRepeatTimes(options[nextIdx]);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  if (!currentPlaying) return null;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef as any}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleAudioEnd}
        preload="auto"
      />

      {/* Floating Audio Bar above Bottom Navigation */}
      <div className="fixed bottom-[60px] left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-3xl mx-auto bg-[#1A202C]/95 backdrop-blur-xl border border-[#C5A059]/60 shadow-2xl p-2.5 sm:p-3 pointer-events-auto transition-all">
          {/* Progress Line */}
          <div className="flex items-center gap-2 mb-1.5 text-[10px] text-stone-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-[#12161F] cursor-pointer accent-[#C5A059]"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Info & Reciter Trigger */}
            <div
              onClick={() => setShowReciterModal(true)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-90 group"
            >
              <div className="w-9 h-9 bg-[#12161F] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:border-[#C5A059] transition-colors shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-100 font-tajawal truncate">
                    سورة {currentSurahMeta?.name || "القرآن"} (آية {currentPlaying.ayah})
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#12161F] border border-[#2D3748] text-[#C5A059] font-mono hidden sm:inline">
                    تغيير القارئ
                  </span>
                </div>
                <p className="text-[11px] text-[#C5A059] truncate font-tajawal">{selectedReciter.name}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Repeat Button */}
              <button
                id="btn-player-repeat"
                onClick={cycleRepeat}
                title={`تكرار الآية: ${repeatTimes === 999 ? "دائم" : `${repeatTimes} مرات`}`}
                className={`p-1.5 text-xs flex items-center gap-0.5 cursor-pointer border ${
                  repeatTimes > 1
                    ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059] font-bold"
                    : "bg-[#12161F] border-[#2D3748] text-stone-400 hover:text-stone-200"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">
                  {repeatTimes === 999 ? "∞" : `${repeatTimes}x`}
                </span>
              </button>

              {/* Speed Button */}
              <button
                id="btn-player-speed"
                onClick={cycleSpeed}
                title="سرعة التلاوة"
                className="p-1.5 bg-[#12161F] border border-[#2D3748] text-stone-300 hover:text-white text-[11px] font-mono cursor-pointer hidden sm:block"
              >
                {playbackSpeed}x
              </button>

              {/* Prev Ayah */}
              <button
                id="btn-player-prev"
                onClick={onPrevAyah}
                title="الآية السابقة"
                className="p-1.5 sm:p-2 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 hover:text-white cursor-pointer"
              >
                <SkipForward className="w-4 h-4 text-[#C5A059]" />
              </button>

              {/* Main Play/Pause Button */}
              <button
                id="btn-player-play-pause"
                onClick={() => (isPlaying ? onPause() : onPlay())}
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                className="p-2.5 sm:p-3 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] border border-[#8B6E3D] shadow-md cursor-pointer transform active:scale-95 transition-transform font-bold"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </button>

              {/* Next Ayah */}
              <button
                id="btn-player-next"
                onClick={onNextAyah}
                title="الآية التالية"
                className="p-1.5 sm:p-2 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 hover:text-white cursor-pointer"
              >
                <SkipBack className="w-4 h-4 text-[#C5A059]" />
              </button>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
                className="p-1.5 bg-[#12161F] border border-[#2D3748] text-stone-400 hover:text-stone-200 cursor-pointer hidden sm:block"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reciter Selector Modal */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2D3748] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#C5A059] uppercase font-mono tracking-widest block">Reciter Selection</span>
                <h3 className="font-bold text-base text-white font-tajawal">
                  اختر القارئ المفضل للتلاوة
                </h3>
              </div>
              <button
                onClick={() => setShowReciterModal(false)}
                className="p-1.5 bg-[#12161F] border border-[#2D3748] text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-2">
              {reciters.map((reciter) => {
                const isSelected = selectedReciter.id === reciter.id;
                return (
                  <div
                    key={reciter.id}
                    onClick={() => {
                      onSelectReciter(reciter);
                      setShowReciterModal(false);
                    }}
                    className={`p-3 border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#12161F] border-[#C5A059] text-[#C5A059]"
                        : "bg-[#12161F] hover:bg-[#1f2735] border-[#2D3748] text-stone-300"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm font-tajawal">{reciter.name}</h4>
                      <p className="text-xs text-stone-400 font-mono">{reciter.englishName}</p>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 bg-[#C5A059] text-[#1A202C] font-bold flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
