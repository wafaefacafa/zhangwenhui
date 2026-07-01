import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { MOCK_PLAYLISTS, MOCK_SONGS, type ISong } from '@/data/music';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  Heart,
  Share2,
  Download,
  MoreHorizontal,
  Music2,
  ArrowLeft,
  Clock,
  User,
} from 'lucide-react';
import { formatDuration, cn } from '@/lib/utils';
import { useMemo } from 'react';
import { toast } from 'sonner';

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    playPlaylist,
    toggleFavorite,
    favorites,
  } = usePlayer();

  const playlist = useMemo(
    () => MOCK_PLAYLISTS.find((p) => p.id === id) ?? MOCK_PLAYLISTS[0],
    [id]
  );

  const songs = useMemo<ISong[]>(() => {
    return playlist.songIds
      .map((sid) => MOCK_SONGS.find((s) => s.id === sid))
      .filter((s): s is ISong => !!s);
  }, [playlist]);

  const totalDuration = useMemo(
    () => songs.reduce((sum, s) => sum + s.duration, 0),
    [songs]
  );

  const isCurrentPlaylist =
    currentSong &&
    songs.some((s) => s.id === currentSong.id) &&
    isPlaying;

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playPlaylist(songs);
      toast.success(`开始播放: ${playlist.title}`);
    }
  };

  const handlePlaySong = (song: ISong) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, songs);
    }
  };

  return (
    <div className="min-h-full pb-24">
      {/* 顶部背景渐变 */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none"
          aria-hidden
        />

        <div className="relative px-6 md:px-8 pt-6 pb-8">
          {/* 返回按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 hover:bg-white/10 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* 歌单信息 */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* 封面 */}
            <div className="relative shrink-0 group">
              <Image
                src={playlist.cover}
                alt={playlist.title}
                className="w-48 h-48 md:w-56 md:h-56 rounded-xl shadow-2xl shadow-black/50 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <Button
                  size="icon"
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg"
                  onClick={handlePlayAll}
                >
                  <Play className="w-6 h-6 ml-1" />
                </Button>
              </div>
            </div>

            {/* 信息 */}
            <div className="flex-1 min-w-0 flex flex-col justify-end">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Music2 className="w-4 h-4" />
                <span>歌单</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 truncate">
                {playlist.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                <button
                  className="flex items-center gap-1.5 hover:text-secondary transition-colors"
                  onClick={() => navigate(`/profile`)}
                >
                  <User className="w-4 h-4" />
                  <span>{playlist.creator}</span>
                </button>
                <span className="flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  {(playlist.playCount / 10000).toFixed(1)}万
                </span>
                <span className="flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5" />
                  {songs.length} 首歌
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(totalDuration)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-6 max-w-2xl">
                {playlist.description}
              </p>

              {/* 操作按钮 */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium px-6 h-10 rounded-full shadow-lg shadow-primary/20"
                  onClick={handlePlayAll}
                >
                  {isCurrentPlaylist ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      暂停播放
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1.5" />
                      播放全部
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="border-white/15 hover:bg-white/10 text-foreground rounded-full h-10"
                  onClick={() => {
                    toggleFavorite(playlist.id);
                    toast.success(
                      favorites.includes(playlist.id)
                        ? '已取消收藏歌单'
                        : '已收藏歌单'
                    );
                  }}
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 mr-2',
                      favorites.includes(playlist.id) &&
                        'fill-destructive text-destructive'
                    )}
                  />
                  {favorites.includes(playlist.id) ? '已收藏' : '收藏'}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/15 hover:bg-white/10 text-foreground rounded-full h-10 w-10"
                  onClick={() => toast.info('分享功能开发中')}
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/15 hover:bg-white/10 text-foreground rounded-full h-10 w-10"
                  onClick={() => toast.info('下载功能开发中')}
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-full h-10 w-10"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 歌曲列表 */}
      <div className="px-6 md:px-8">
        <div className="rounded-xl overflow-hidden">
          {/* 表头 */}
          <div className="grid grid-cols-[40px_1fr_180px_100px_80px] md:grid-cols-[40px_1fr_200px_200px_120px_80px] gap-4 px-4 py-2.5 text-xs text-muted-foreground border-b border-white/5">
            <div className="text-center">#</div>
            <div>标题</div>
            <div className="hidden md:block">专辑</div>
            <div>歌手</div>
            <div className="text-right hidden md:block">时长</div>
            <div className="text-right">操作</div>
          </div>

          {/* 歌曲行 */}
          <div className="divide-y divide-white/[0.03]">
            {songs.map((song, index) => {
              const isActive = currentSong?.id === song.id;
              const isFav = favorites.includes(song.id);

              return (
                <div
                  key={song.id}
                  className={cn(
                    'group grid grid-cols-[40px_1fr_180px_100px_80px] md:grid-cols-[40px_1fr_200px_200px_120px_80px] gap-4 px-4 py-2.5 items-center text-sm hover:bg-white/5 transition-colors cursor-pointer',
                    isActive && 'bg-primary/10 hover:bg-primary/15'
                  )}
                  onClick={() => handlePlaySong(song)}
                >
                  {/* 序号 / 播放状态 */}
                  <div className="text-center text-muted-foreground">
                    {isActive && isPlaying ? (
                      <div className="flex items-center justify-center gap-0.5 h-4">
                        <span className="w-0.5 h-2 bg-secondary rounded-full animate-pulse" />
                        <span
                          className="w-0.5 h-3 bg-secondary rounded-full animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <span
                          className="w-0.5 h-1.5 bg-secondary rounded-full animate-pulse"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </div>
                    ) : (
                      <>
                        <span className="group-hover:hidden">
                          {index + 1}
                        </span>
                        <Play
                          className={cn(
                            'w-3.5 h-3.5 hidden group-hover:inline ml-1',
                            isActive ? 'text-secondary' : 'text-foreground'
                          )}
                        />
                      </>
                    )}
                  </div>

                  {/* 标题 */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={song.cover}
                      alt={song.title}
                      className="w-9 h-9 rounded-md object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div
                        className={cn(
                          'font-medium truncate',
                          isActive
                            ? 'text-secondary'
                            : 'text-foreground'
                        )}
                      >
                        {song.title}
                      </div>
                    </div>
                  </div>

                  {/* 专辑 */}
                  <div
                    className="hidden md:block text-muted-foreground truncate hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/album/${song.albumId}`);
                    }}
                  >
                    {song.album}
                  </div>

                  {/* 歌手 */}
                  <div
                    className="text-muted-foreground truncate hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/artist/${song.artistId}`);
                    }}
                  >
                    {song.artist}
                  </div>

                  {/* 时长 */}
                  <div className="text-right text-muted-foreground tabular-nums hidden md:block">
                    {formatDuration(song.duration)}
                  </div>

                  {/* 操作 */}
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 hover:bg-white/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song.id);
                      }}
                    >
                      <Heart
                        className={cn(
                          'w-4 h-4',
                          isFav && 'fill-destructive text-destructive'
                        )}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 hover:bg-white/10 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('更多操作');
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {songs.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            该歌单暂无歌曲
          </div>
        )}
      </div>
    </div>
  );
}
