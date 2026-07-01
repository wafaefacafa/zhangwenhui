import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Heart,
  Download,
  Share2,
  MoreHorizontal,
  ArrowLeft,
  Clock,
  Music,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MOCK_ALBUMS,
  MOCK_SONGS,
  type ISong,
} from '@/data/music';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';
import { toast } from 'sonner';

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    playPlaylist,
    toggleFavorite,
    isFavorite,
    queue,
  } = usePlayer();

  const album = useMemo(() => {
    return MOCK_ALBUMS.find((a) => a.id === id) ?? MOCK_ALBUMS[0];
  }, [id]);

  const albumSongs = useMemo(() => {
    return album.songIds
      .map((sid) => MOCK_SONGS.find((s) => s.id === sid))
      .filter(Boolean) as ISong[];
  }, [album]);

  const totalDuration = useMemo(() => {
    return albumSongs.reduce((sum, s) => sum + s.duration, 0);
  }, [albumSongs]);

  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);

  const isCurrentAlbum = currentSong?.albumId === album.id;
  const isAlbumPlaying = isCurrentAlbum && isPlaying;

  const handlePlayAll = () => {
    playPlaylist(albumSongs);
    toast.success(`开始播放专辑「${album.title}」`);
  };

  const handleSongClick = (song: ISong) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, albumSongs);
    }
  };

  const handleToggleFavorite = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(songId);
    const song = albumSongs.find((s) => s.id === songId);
    if (song) {
      if (isFavorite(songId)) {
        toast.success(`已收藏「${song.title}」`);
      } else {
        toast.info(`已取消收藏「${song.title}」`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 顶部渐变背景 */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-card/50 to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/30 blur-[120px] -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-secondary/20 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-6 pb-8">
          {/* 返回按钮 */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-muted-foreground hover:text-foreground hover:bg-white/10 -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>

          {/* 专辑信息区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* 专辑封面 */}
            <div className="relative shrink-0">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <Image
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 光晕装饰 */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl -z-10" />
            </div>

            {/* 专辑信息 */}
            <div className="flex-1 min-w-0 flex flex-col justify-end pt-2">
              <Badge variant="outline" className="w-fit mb-4 border-primary/30 text-primary bg-primary/10">
                <Music className="w-3 h-3 mr-1.5" />
                专辑
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                {album.title}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <Link
                  to={`/artist/${album.artistId}`}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {album.artist[0]}
                    </span>
                  </div>
                  <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                    {album.artist}
                  </span>
                </Link>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-sm text-muted-foreground">
                  {album.releaseDate}
                </span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-sm text-muted-foreground">
                  {albumSongs.length} 首歌曲
                </span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-sm text-muted-foreground">
                  总时长 {formatDuration(totalDuration)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 max-w-2xl">
                {album.description}
              </p>

              {/* 操作按钮 */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium shadow-lg shadow-primary/30"
                  onClick={handlePlayAll}
                >
                  {isAlbumPlaying ? (
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
                  size="icon"
                  variant="secondary"
                  className="h-11 w-11 rounded-full bg-card/80 hover:bg-card border border-white/10"
                  onClick={() => toast.success('已添加到播放队列')}
                  title="添加到播放队列"
                >
                  <Plus className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  className="h-11 w-11 rounded-full bg-card/80 hover:bg-card border border-white/10"
                  onClick={() => toast.success('已开始下载专辑')}
                  title="下载专辑"
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  className="h-11 w-11 rounded-full bg-card/80 hover:bg-card border border-white/10"
                  onClick={() => toast.success('分享链接已复制')}
                  title="分享"
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  className="h-11 w-11 rounded-full bg-card/80 hover:bg-card border border-white/10"
                  title="更多"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 曲目列表 */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">曲目列表</h2>
            <span className="text-sm text-muted-foreground">
              共 {albumSongs.length} 首
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="w-12 text-center text-muted-foreground font-normal">
                    #
                  </TableHead>
                  <TableHead className="text-muted-foreground font-normal">
                    歌曲
                  </TableHead>
                  <TableHead className="w-32 text-muted-foreground font-normal">
                    歌手
                  </TableHead>
                  <TableHead className="w-24 text-right text-muted-foreground font-normal">
                    <Clock className="w-4 h-4 inline" />
                  </TableHead>
                  <TableHead className="w-20 text-right text-muted-foreground font-normal">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {albumSongs.map((song, index) => {
                  const isCurrent = currentSong?.id === song.id;
                  const isHovered = hoveredSongId === song.id;
                  const liked = isFavorite(song.id);

                  return (
                    <TableRow
                      key={song.id}
                      className={`
                        border-b border-white/5 last:border-0 cursor-pointer transition-colors
                        ${isCurrent ? 'bg-primary/10' : 'hover:bg-white/[0.03]'}
                      `}
                      onMouseEnter={() => setHoveredSongId(song.id)}
                      onMouseLeave={() => setHoveredSongId(null)}
                      onClick={() => handleSongClick(song)}
                    >
                      <TableCell className="text-center py-2.5">
                        <div className="w-6 h-6 flex items-center justify-center mx-auto">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end gap-[2px] h-4">
                              <motion.span
                                className="w-[2px] bg-primary rounded-full"
                                animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                              />
                              <motion.span
                                className="w-[2px] bg-secondary rounded-full"
                                animate={{ height: ['70%', '30%', '90%', '50%', '70%'] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                              />
                              <motion.span
                                className="w-[2px] bg-primary rounded-full"
                                animate={{ height: ['50%', '80%', '30%', '70%', '50%'] }}
                                transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                              />
                            </div>
                          ) : isHovered ? (
                            <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                          ) : (
                            <span className={`text-sm ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={song.cover}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-sm font-medium truncate ${
                                isCurrent ? 'text-primary' : 'text-foreground'
                              }`}
                            >
                              {song.title}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5">
                        <Link
                          to={`/artist/${song.artistId}`}
                          className="text-sm text-muted-foreground hover:text-secondary transition-colors truncate block max-w-[150px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {song.artist}
                        </Link>
                      </TableCell>

                      <TableCell className="text-right py-2.5">
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {formatDuration(song.duration)}
                        </span>
                      </TableCell>

                      <TableCell className="text-right py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-8 w-8 hover:bg-white/10 ${
                              liked ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={(e) => handleToggleFavorite(song.id, e)}
                          >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`开始下载「${song.title}」`);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Plus icon inline component (避免额外 import 问题)
function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
