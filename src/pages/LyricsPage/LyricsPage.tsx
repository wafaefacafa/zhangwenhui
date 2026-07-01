import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Minimize2,
  Pin,
  Settings,
  MoreHorizontal,
  ChevronDown,
  Menu,
  X,
  SkipBack,
  Rewind,
  FastForward,
  SkipForward,
  Mic,
  Heart,
  LayoutGrid,
  Volume2,
  Play,
  Pause,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function LyricsPage() {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    favorites,
    togglePlay,
    nextSong,
    prevSong,
    setProgress,
    setVolume,
    toggleFavorite,
  } = usePlayer();

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const lyrics = currentSong?.lyrics ?? [];

  // 计算当前高亮行索引
  const activeIndex = useMemo(() => {
    if (lyrics.length === 0) return 0;
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i] && progress >= lyrics[i].time) {
        idx = i;
      }
    }
    return idx;
  }, [progress, lyrics]);

  // 自动滚动到当前行
  useEffect(() => {
    if (activeLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeEl = activeLineRef.current;
      const containerHeight = container.clientHeight;
      const activeTop = activeEl.offsetTop;
      const activeHeight = activeEl.offsetHeight;
      const targetScroll = activeTop - containerHeight / 2 + activeHeight / 2;
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !currentSong) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setProgress(percent * currentSong.duration);
    },
    [currentSong, setProgress]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(Math.round(percent * 100));
    },
    [setVolume]
  );

  const isFavorite = currentSong ? favorites.includes(currentSong.id) : false;
  const progressPercent = currentSong ? (progress / currentSong.duration) * 100 : 0;
  const duration = currentSong?.duration ?? 0;

  return (
    <div className="relative w-full h-screen bg-[#0a0f1e] overflow-hidden flex flex-col">
      {/* 背景渐变光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-secondary/20 blur-[150px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* 顶部窗口栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-20 flex items-center justify-between px-6 py-4"
      >
        <div className="text-xs text-muted-foreground/60">PC端</div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-foreground/80 font-medium">全屏歌词</span>
          <div className="w-12 h-[2px] bg-white/40 mt-1 rounded-full" />
        </div>
        <div className="flex items-center gap-1">
          {[Minimize2, Pin, Settings, MoreHorizontal, ChevronDown, Menu].map((Icon, i) => (
            <button
              key={i}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors ml-1"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* 歌词区域 */}
      <div
        ref={lyricsContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative px-8"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`
          .lyrics-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        <div className="py-[40vh] flex flex-col items-center gap-5 lyrics-scroll">
          {lyrics.length === 0 ? (
            <div className="text-muted-foreground/50 text-lg">暂无歌词</div>
          ) : (
            lyrics.map((line, i) => {
              const isActive = i === activeIndex;
              const isNear = Math.abs(i - activeIndex) <= 2;
              const distance = Math.abs(i - activeIndex);
              const opacity = isActive
                ? 1
                : distance === 1
                ? 0.5
                : distance === 2
                ? 0.3
                : 0.15;

              return (
                <motion.div
                  key={i}
                  ref={isActive ? activeLineRef : null}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity,
                    y: 0,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={cn(
                    'text-center transition-all duration-300 cursor-pointer',
                    isActive
                      ? 'text-foreground text-xl md:text-2xl font-semibold'
                      : 'text-muted-foreground text-base md:text-lg'
                  )}
                  style={
                    isActive
                      ? {
                          textShadow:
                            '0 0 20px hsl(239 84% 67% / 0.6), 0 0 40px hsl(189 94% 43% / 0.4)',
                        }
                      : undefined
                  }
                  onClick={() => setProgress(line.time)}
                >
                  {line.text}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 底部播放控制栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-20 bg-black/40 backdrop-blur-xl border-t border-white/5 px-6 py-4"
      >
        {/* 进度条 */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={prevSong}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setProgress(Math.max(0, progress - 5))}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Rewind className="w-5 h-5" />
          </button>
          <span className="text-xs text-muted-foreground tabular-nums w-12 text-right shrink-0">
            {formatTime(progress)}
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
            onClick={handleProgressClick}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-12 shrink-0">
            {formatTime(duration)}
          </span>
          <button
            onClick={() => setProgress(Math.min(duration, progress + 5))}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <FastForward className="w-5 h-5" />
          </button>
          <button
            onClick={nextSong}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* 主控制行 */}
        <div className="flex items-center justify-between">
          <div className="w-32" />

          {/* 中间播放按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSong}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:opacity-90 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* 右侧功能 */}
          <div className="flex items-center gap-2 w-32 justify-end">
            <button
              className="text-secondary/80 hover:text-secondary transition-colors"
              title="歌词"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => currentSong && toggleFavorite(currentSong.id)}
              className={cn(
                'transition-colors',
                isFavorite
                  ? 'text-destructive hover:text-destructive/80'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="收藏"
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="布局"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div
                ref={volumeRef}
                className="w-16 h-1 bg-white/10 rounded-full cursor-pointer group relative"
                onClick={handleVolumeClick}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: `${volume}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
