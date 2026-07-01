import { usePlayer } from '@/context/PlayerContext';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
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
  ListMusic,
  Maximize2,
  ChevronUp,
  Mic2,
  MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    progress,
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
    duration,
  } = usePlayer();

  const navigate = useNavigate();
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(volume);

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

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5">
      {/* 顶部渐变装饰线 */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-80" />

      <div className="bg-card/80 backdrop-blur-xl px-4 py-2.5">
        <div className="flex items-center gap-4">
          {/* 左侧：歌曲信息 */}
          <div className="flex items-center gap-3 w-64 min-w-0">
            <div
              className="relative shrink-0 cursor-pointer group"
              onClick={() => navigate('/player')}
            >
              <Image
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-12 h-12 rounded-md object-cover shadow-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <ChevronUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                onClick={() => navigate('/player')}
              >
                {currentSong.title}
              </div>
              <div
                className="text-xs text-muted-foreground truncate cursor-pointer hover:text-secondary transition-colors"
                onClick={() => navigate(`/artist/${currentSong.artistId}`)}
              >
                {currentSong.artist}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                'shrink-0 h-8 w-8 hover:bg-white/10',
                isFavorite && 'text-destructive hover:text-destructive'
              )}
              onClick={() => toggleFavorite(currentSong.id)}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </Button>
          </div>

          {/* 中间：播放控制 + 进度条 */}
          <div className="flex-1 flex flex-col items-center gap-1.5 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground',
                  playMode !== 'sequence' && 'text-secondary'
                )}
                onClick={togglePlayMode}
                title={
                  playMode === 'sequence'
                    ? '顺序播放'
                    : playMode === 'loop'
                    ? '单曲循环'
                    : '随机播放'
                }
              >
                <PlayModeIcon className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-white/10 text-foreground"
                onClick={prevSong}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-white/10 text-foreground"
                onClick={nextSong}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/queue')}
                title="播放队列"
              >
                <ListMusic className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-full flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground tabular-nums w-10 text-right shrink-0">
                {formatTime(progress)}
              </span>
              <div
                ref={progressRef}
                className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group relative"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums w-10 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* 右侧：功能按钮 */}
          <div className="flex items-center gap-1 w-64 justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              title="歌词"
              onClick={() => navigate('/lyrics')}
            >
              <Mic2 className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
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
              className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              title="播放队列"
              onClick={() => navigate('/queue')}
            >
              <ListMusic className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              title="全屏歌词"
              onClick={() => navigate('/lyrics')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              title="更多"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
