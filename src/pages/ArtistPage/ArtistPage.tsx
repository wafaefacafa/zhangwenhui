import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Play,
  Pause,
  Users,
  Music2,
  Download,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePlayer } from '@/context/PlayerContext';
import { MOCK_ARTISTS, MOCK_SONGS, MOCK_ALBUMS, type ISong } from '@/data/music';
import { formatDuration, formatPlayCount, cn } from '@/lib/utils';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSong, playPlaylist, toggleFavorite, isFavorite, isPlaying, currentSong } = usePlayer();

  const [isFollowed, setIsFollowed] = useState(false);

  const artist = useMemo(() => {
    return MOCK_ARTISTS.find((a) => a.id === id) ?? MOCK_ARTISTS[0];
  }, [id]);

  const hotSongs = useMemo(() => {
    return artist.hotSongIds
      .map((sid) => MOCK_SONGS.find((s) => s.id === sid))
      .filter(Boolean) as ISong[];
  }, [artist]);

  const albums = useMemo(() => {
    return artist.albumIds
      .map((aid) => MOCK_ALBUMS.find((a) => a.id === aid))
      .filter(Boolean);
  }, [artist]);

  const handlePlayAll = () => {
    playPlaylist(hotSongs);
  };

  const handlePlaySong = (song: ISong) => {
    playSong(song, hotSongs);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 顶部渐变背景 */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 right-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-40 relative z-10">
        {/* 歌手简介卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-card/60 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* 头像 */}
                <div className="relative shrink-0">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 光晕 */}
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl -z-10" />
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                      歌手
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {artist.followers.toLocaleString()} 粉丝
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                    {artist.name}
                  </h1>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl line-clamp-3">
                    {artist.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="lg"
                      className={cn(
                        'gap-2 font-medium',
                        isFollowed
                          ? 'bg-muted hover:bg-muted/80 text-foreground'
                          : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30'
                      )}
                      onClick={() => setIsFollowed((v) => !v)}
                    >
                      <Heart className={cn('w-4 h-4', isFollowed && 'fill-current')} />
                      {isFollowed ? '已关注' : '关注'}
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 border-white/20 hover:bg-white/10 text-foreground"
                      onClick={handlePlayAll}
                    >
                      {isPlaying && currentSong?.artistId === artist.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      热门歌曲
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* 右侧数据 */}
                <div className="hidden lg:flex flex-col gap-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        {hotSongs.length}
                      </div>
                      <div className="text-xs text-muted-foreground">热门单曲</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatPlayCount(artist.followers)}
                      </div>
                      <div className="text-xs text-muted-foreground">粉丝数</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs 区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <Tabs defaultValue="songs" className="w-full">
            <TabsList className="bg-transparent h-10 gap-6 mb-6 border-b border-white/5 rounded-none w-full justify-start p-0">
              <TabsTrigger
                value="songs"
                className="data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground relative h-10 px-1 rounded-none"
              >
                热门歌曲
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
              </TabsTrigger>
              <TabsTrigger
                value="albums"
                className="data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground relative h-10 px-1 rounded-none"
              >
                专辑
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground relative h-10 px-1 rounded-none"
              >
                简介
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
              </TabsTrigger>
            </TabsList>

            {/* 热门歌曲 */}
            <TabsContent value="songs" className="mt-0">
              <Card className="bg-card/40 backdrop-blur-sm border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 h-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={handlePlayAll}
                    >
                      <Play className="w-3.5 h-3.5" />
                      播放全部
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      共 {hotSongs.length} 首
                    </span>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium w-12">#</th>
                        <th className="px-2 py-2.5 font-medium min-w-[200px]">歌曲</th>
                        <th className="px-4 py-2.5 font-medium min-w-[140px] hidden md:table-cell">
                          专辑
                        </th>
                        <th className="px-4 py-2.5 font-medium w-20 hidden sm:table-cell">
                          时长
                        </th>
                        <th className="px-4 py-2.5 font-medium w-28 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotSongs.map((song, index) => {
                        const isCurrent = currentSong?.id === song.id;
                        const isFav = isFavorite(song.id);
                        return (
                          <tr
                            key={song.id}
                            className={cn(
                              'group border-t border-white/5 transition-colors',
                              isCurrent ? 'bg-primary/10' : 'hover:bg-white/5'
                            )}
                          >
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  'text-sm tabular-nums',
                                  isCurrent
                                    ? 'text-primary'
                                    : 'text-muted-foreground group-hover:text-foreground'
                                )}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                                  <Image
                                    src={song.cover}
                                    alt={song.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    onClick={() => handlePlaySong(song)}
                                  >
                                    {isCurrent && isPlaying ? (
                                      <Pause className="w-4 h-4 text-white" />
                                    ) : (
                                      <Play className="w-4 h-4 text-white ml-0.5" />
                                    )}
                                  </button>
                                </div>
                                <div className="min-w-0">
                                  <div
                                    className={cn(
                                      'text-sm font-medium truncate cursor-pointer hover:text-primary transition-colors',
                                      isCurrent ? 'text-primary' : 'text-foreground'
                                    )}
                                    onClick={() => handlePlaySong(song)}
                                  >
                                    {song.title}
                                  </div>
                                  <div
                                    className="text-xs text-muted-foreground truncate cursor-pointer hover:text-secondary transition-colors"
                                    onClick={() => navigate(`/artist/${song.artistId}`)}
                                  >
                                    {song.artist}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span
                                className="text-sm text-muted-foreground truncate block max-w-[180px] cursor-pointer hover:text-secondary transition-colors"
                                onClick={() => navigate(`/album/${song.albumId}`)}
                              >
                                {song.album}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className="text-sm text-muted-foreground tabular-nums">
                                {formatDuration(song.duration)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={cn(
                                    'h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity',
                                    isFav && 'text-destructive opacity-100'
                                  )}
                                  onClick={() => toggleFavorite(song.id)}
                                >
                                  <Heart
                                    className={cn('w-4 h-4', isFav && 'fill-current')}
                                  />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-opacity"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-opacity"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* 专辑 */}
            <TabsContent value="albums" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {albums.map((album, i) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/album/${album.id}`)}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
                      <Image
                        src={album.cover}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          const albumSongs = album.songIds
                            .map((sid) => MOCK_SONGS.find((s) => s.id === sid))
                            .filter(Boolean) as ISong[];
                          playPlaylist(albumSongs);
                        }}
                      >
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </button>
                    </div>
                    <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {album.releaseDate}
                    </p>
                  </motion.div>
                ))}
              </div>

              {albums.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  暂无专辑
                </div>
              )}
            </TabsContent>

            {/* 简介 */}
            <TabsContent value="about" className="mt-0">
              <Card className="bg-card/40 backdrop-blur-sm border-white/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">歌手简介</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {artist.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {hotSongs.length}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">单曲</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {albums.length}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">专辑</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {formatPlayCount(artist.followers)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">粉丝</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        99%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">好评率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* 相似歌手推荐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 mb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground">相似歌手</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1 h-8"
            >
              查看更多
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {MOCK_ARTISTS.filter((a) => a.id !== artist.id)
              .slice(0, 6)
              .map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.05 }}
                  className="group cursor-pointer text-center"
                  onClick={() => navigate(`/artist/${a.id}`)}
                >
                  <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 shadow-lg ring-2 ring-white/5 group-hover:ring-primary/40 transition-all">
                    <Image
                      src={a.avatar}
                      alt={a.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {a.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPlayCount(a.followers)} 粉丝
                  </p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
