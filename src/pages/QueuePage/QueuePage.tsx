import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Trash2,
  Clock,
  ListMusic,
  History,
  X,
  MoreHorizontal,
  Music2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { type ISong } from '@/data/music';

function SongRow({
  song,
  isActive,
  index,
  onPlay,
  onRemove,
  isHistory = false,
}: {
  song: ISong;
  isActive: boolean;
  index: number;
  onPlay: () => void;
  onRemove: () => void;
  isHistory?: boolean;
}) {
  const { isPlaying, toggleFavorite, favorites } = usePlayer();
  const isFav = favorites.includes(song.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
        isActive
          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30'
          : 'hover:bg-white/5 border border-transparent'
      )}
      onClick={onPlay}
    >
      {/* 序号 / 播放状态 */}
      <div className="w-6 text-center shrink-0">
        {isActive && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-4">
            <span className="w-0.5 bg-secondary rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
            <span className="w-0.5 bg-primary rounded-full animate-[pulse_1s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
            <span className="w-0.5 bg-secondary rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" style={{ height: '40%' }} />
          </div>
        ) : (
          <span className={cn(
            'text-sm tabular-nums',
            isActive ? 'text-secondary font-semibold' : 'text-muted-foreground'
          )}>
            {index + 1}
          </span>
        )}
      </div>

      {/* 封面 */}
      <div className="relative shrink-0">
        <Image
          src={song.cover}
          alt={song.title}
          className="w-10 h-10 rounded-md object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
          {isActive && isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </div>
      </div>

      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          'text-sm font-medium truncate',
          isActive ? 'text-secondary' : 'text-foreground'
        )}>
          {song.title}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {song.artist}
        </div>
      </div>

      {/* 专辑 */}
      <div className="hidden md:block text-sm text-muted-foreground truncate w-40">
        {song.album}
      </div>

      {/* 时长 */}
      <div className="text-xs text-muted-foreground tabular-nums shrink-0 w-12 text-right">
        {formatDuration(song.duration)}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
            toast.success(isFav ? '已取消收藏' : '已添加到我喜欢');
          }}
          title={isFav ? '取消收藏' : '收藏'}
        >
          <svg
            viewBox="0 0 24 24"
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </Button>
        {!isHistory && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="从队列移除"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
          title="更多"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function QueuePage() {
  const {
    queue,
    currentSong,
    isPlaying,
    recentPlay,
    playSong,
    togglePlay,
    clearQueue,
    removeFromQueue,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const currentIndex = useMemo(() => {
    if (!currentSong) return -1;
    return queue.findIndex((s) => s.id === currentSong.id);
  }, [queue, currentSong]);

  const handleClearQueue = () => {
    clearQueue();
    setShowClearConfirm(false);
    toast.success('播放队列已清空');
  };

  const handlePlaySong = (song: ISong) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  const handlePlayHistory = (song: ISong) => {
    playSong(song, [...recentPlay]);
    toast.success(`正在播放: ${song.title}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部渐变装饰 */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">播放队列</h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'queue'
                ? `共 ${queue.length} 首歌曲`
                : `最近播放 ${recentPlay.length} 首`}
            </p>
          </div>

          {activeTab === 'queue' && queue.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                清空队列
              </Button>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'queue' | 'history')}
            className="w-full"
          >
            <TabsList className="bg-card/50 mb-6 p-1">
              <TabsTrigger value="queue" className="gap-2 data-[state=active]:bg-background">
                <ListMusic className="w-4 h-4" />
                当前队列
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-background">
                <History className="w-4 h-4" />
                历史记录
              </TabsTrigger>
            </TabsList>

            {/* 当前队列 */}
            <TabsContent value="queue" className="mt-0">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4">
                    <Music2 className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">播放队列为空</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    去发现页找找喜欢的音乐，添加到播放队列吧
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {queue.map((song, index) => (
                      <SongRow
                        key={song.id}
                        song={song}
                        isActive={currentSong?.id === song.id}
                        index={index}
                        onPlay={() => handlePlaySong(song)}
                        onRemove={() => {
                          removeFromQueue(song.id);
                          toast.success(`已从队列移除: ${song.title}`);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* 历史记录 */}
            <TabsContent value="history" className="mt-0">
              {recentPlay.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4">
                    <Clock className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">暂无播放记录</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    开始播放音乐后，记录会显示在这里
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {recentPlay.map((song, index) => (
                      <SongRow
                        key={`${song.id}-${index}`}
                        song={song}
                        isActive={currentSong?.id === song.id && isPlaying}
                        index={index}
                        onPlay={() => handlePlayHistory(song)}
                        onRemove={() => {}}
                        isHistory
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* 清空确认对话框 */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">清空播放队列？</h3>
              <p className="text-sm text-muted-foreground mb-6">
                清空后当前播放将停止，队列中的 {queue.length} 首歌曲将被移除。此操作不可撤销。
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(false)}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearQueue}
                >
                  确认清空
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
