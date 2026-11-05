import React, { useState, useEffect, useRef } from 'react';
import { 
  InstagramScript 
} from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Sliders, 
  FlipHorizontal, 
  Maximize, 
  Minimize,
  Type,
  Gauge
} from 'lucide-react';

interface TeleprompterModalProps {
  script: InstagramScript | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  script,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(36); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Combine hook and scenes into seamless teleprompter text chunks
  const promptLines = script
    ? [
        {
          label: '⚡ الهوك الافتتاحي',
          text: script.hookOptions[0]?.spokenText || '',
          timestamp: '0:00 - 0:03',
        },
        ...script.scenes.map((s) => ({
          label: `مشهد ${s.sceneNumber}`,
          text: s.spokenText,
          timestamp: s.timestamp,
        })),
        {
          label: '🎯 الختام والتفاعل',
          text: script.callToAction,
          timestamp: 'الختام',
        },
      ]
    : [];

  // Reset scroll on open
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Smooth scroll loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const scrollLoop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += scrollSpeed * 0.75;
        // Check if reached bottom
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setIsPlaying(false);
          return;
        }
      }
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  // Keyboard shortcut: Space to toggle play/pause, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayWithCountdown();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying]);

  const togglePlayWithCountdown = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    // Start 3-second countdown
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsPlaying(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !script) return null;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col text-white select-none overflow-hidden"
      dir="rtl"
    >
      {/* Top Floating Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>ملقن التصوير المباشر</span>
          </div>
          <span className="text-sm font-bold text-slate-300 hidden sm:inline line-clamp-1">
            {script.title}
          </span>
        </div>

        {/* Setting sliders and options */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Speed slider */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">السرعة:</span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-amber-300 w-5 text-center">{scrollSpeed}x</span>
          </div>

          {/* Font size slider */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">الحجم:</span>
            <input
              type="range"
              min="24"
              max="58"
              step="4"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-amber-300 w-7 text-center">{fontSize}</span>
          </div>

          {/* Mirror Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isMirrored
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="انعكاس مرآة (لشاشات الملقن الاحترافي)"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">مرآة</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
            title="إغلاق (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Teleprompter Text Canvas */}
      <div className="relative flex-1 overflow-hidden bg-black flex justify-center">
        
        {/* Eye level reading guide line */}
        <div className="absolute top-1/3 left-0 right-0 h-24 border-y border-amber-500/20 bg-amber-500/[0.03] pointer-events-none z-10 flex items-center justify-between px-6">
          <span className="text-[10px] uppercase tracking-widest text-amber-500/60 font-mono">
            خط النظر للكاميرا ▶
          </span>
          <span className="text-[10px] uppercase tracking-widest text-amber-500/60 font-mono">
            ◀ EYE LEVEL
          </span>
        </div>

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="text-center">
              <span className="text-8xl sm:text-9xl font-black text-amber-400 animate-bounce block">
                {countdown}
              </span>
              <p className="text-xl font-bold text-slate-300 mt-4">
                استعد أمام الكاميرا وابدأ الابتسامة! 🎬
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className={`w-full max-w-4xl px-8 sm:px-16 pt-32 pb-96 overflow-y-auto no-scrollbar scroll-smooth transition-transform ${
            isMirrored ? 'scale-x-[-1]' : ''
          }`}
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="space-y-12">
            {promptLines.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                    {item.label}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {item.timestamp}
                  </span>
                </div>
                <p
                  className="font-black text-slate-100 teleprompter-text tracking-wide"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Floating Playbar */}
      <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-center gap-4 z-20">
        
        {/* Reset button */}
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          title="إعادة للأعلى"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Giant Play/Pause button */}
        <button
          onClick={togglePlayWithCountdown}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-base transition-all cursor-pointer shadow-xl ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>إيقاف مؤقت (Space)</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ التلقين (Space)</span>
            </>
          )}
        </button>

        <span className="text-xs text-slate-400 hidden sm:inline">
          اضغط مسافة (Space) للبدء أو التوقف
        </span>
      </div>

    </div>
  );
};
