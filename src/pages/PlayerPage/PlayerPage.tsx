import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Download,
  MoreHorizontal,
  Maximize2,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerPage() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    playMode,
    favorites,
    togglePlay,
    nextSong,
    prevSong,
    setProgress,
    setVolume,
    togglePlayMode,
    toggleFavorite,
  } = usePlayer();

  const navigate = useNavigate();
  const lyricsRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(volume);

  const lyrics = currentSong?.lyrics ?? [];

  // 当前歌词行索引
  const currentLyricIndex = useMemo(() => {
    if (lyrics.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (progress >= lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [progress, lyrics]);

  // 自动滚动到当前歌词行
  useEffect(() => {
    if (activeLineRef.current && lyricsRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLyricIndex]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setProgress(percent * duration);
    },
    [duration, setProgress]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newVol = Math.round(percent * 100);
      setVolume(newVol);
      if (newVol > 0) setIsMuted(false);
    },
    [setVolume]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(prevVolumeRef.current || 70);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, setVolume]);

  const isFavorite = currentSong ? favorites.includes(currentSong.id) : false;

  const PlayModeIcon = playMode === 'loop' ? Repeat1 : playMode === 'random' ? Shuffle : Repeat;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume;

  if (!currentSong) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">暂无播放歌曲</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* 背景渐变光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-secondary/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* 顶部返回栏 */}
      <div className="relative z-10 flex items-center gap-4 px-6 py-4">
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 hover:bg-white/10 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">播放详情</h1>
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：黑胶唱片 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* 黑胶唱片机容器 */}
            <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
              {/* 唱机底座 */}
              <div className="absolute inset-0 rounded-[40px] bg-card/60 backdrop-blur-sm border border-white/5 shadow-2xl shadow-black/30" />

              {/* 唱臂 */}
              <div className="absolute top-6 right-6 z-20 origin-top-right transition-transform duration-700" style={{ transform: isPlaying ? 'rotate(25deg)' : 'rotate(0deg)' }}>
                <div className="w-1.5 h-32 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-full shadow-lg" />
                <div className="absolute -bottom-2 -left-1.5 w-4 h-6 bg-zinc-500 rounded-sm shadow-md" />
              </div>

              {/* 黑胶唱片 */}
              <div
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full',
                  isPlaying && 'animate-[spin_8s_linear_infinite]'
                )}
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
              >
                {/* 唱片纹理环 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50">
                  {/* 唱片凹槽纹理 */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-black/30"
                      style={{
                        inset: `${(i + 1) * 12}px`,
                      }}
                    />
                  ))}
                </div>

                {/* 中心封面 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden shadow-xl ring-4 ring-zinc-800">
                  <Image
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  {/* 中心孔 */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700" />
                </div>
              </div>

              {/* 唱机装饰按钮 */}
              <div className="absolute bottom-6 left-6 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
            </div>

            {/* 歌曲信息 */}
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">{currentSong.title}</h2>
              <p
                className="text-muted-foreground hover:text-secondary cursor-pointer transition-colors"
                onClick={() => navigate(`/artist/${currentSong.artistId}`)}
              >
                {currentSong.artist}
              </p>
              <p
                className="text-sm text-muted-foreground/70 mt-1 hover:text-primary/70 cursor-pointer transition-colors"
                onClick={() => navigate(`/album/${currentSong.albumId}`)}
              >
                {currentSong.album}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'h-10 w-10 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground',
                  isFavorite && 'text-destructive hover:text-destructive'
                )}
                onClick={() => toggleFavorite(currentSong.id)}
              >
                <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* 右侧：歌词 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-1">歌词</h3>
              <p className="text-lg font-semibold text-foreground">
                {currentSong.title} - {currentSong.artist}
              </p>
            </div>

            {/* 歌词滚动区 */}
            <div
              ref={lyricsRef}
              className="relative h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-4"
              style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
            >
              <div className="py-32 space-y-5">
                {lyrics.length === 0 ? (
                  <div className="text-center text-muted-foreground py-20">
                    暂无歌词
                  </div>
                ) : (
                  lyrics.map((line, index) => {
                    const isActive = index === currentLyricIndex;
                    const isPast = index < currentLyricIndex;
                    return (
                      <div
                        key={index}
                        ref={isActive ? activeLineRef : null}
                        className={cn(
                          'text-center transition-all duration-300',
                          isActive
                            ? 'text-lg font-semibold text-secondary scale-105 drop-shadow-[0_0_8px_rgba(6_182_212_0.5)]'
                            : isPast
                            ? 'text-foreground/80 text-base'
                            : 'text-muted-foreground/50 text-base'
                        )}
                      >
                        {line.text}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部播放控制条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          {/* 进度条 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-muted-foreground tabular-nums w-10 text-right shrink-0">
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
            <span className="text-xs text-muted-foreground tabular-nums w-10 shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between">
            {/* 左：播放模式 */}
            <div className="flex items-center gap-2 w-32">
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'h-9 w-9 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground',
                  playMode !== 'sequence' && 'text-secondary'
                )}
                onClick={togglePlayMode}
              >
                <PlayModeIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* 中：主控制 */}
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-white/10 text-foreground"
                onClick={prevSong}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary hover:opacity-90 text-white shadow-xl shadow-primary/30"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-white/10 text-foreground"
                onClick={nextSong}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* 右：音量 + 全屏歌词 */}
            <div className="flex items-center gap-2 w-32 justify-end">
              <div className="flex items-center gap-1.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <div
                  ref={volumeRef}
                  className="w-20 h-1 bg-white/10 rounded-full cursor-pointer group relative"
                  onClick={handleVolumeClick}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${volumePercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${volumePercent}% - 5px)` }}
                  />
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/lyrics')}
                title="全屏歌词"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
