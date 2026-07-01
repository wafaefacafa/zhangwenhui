import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Search,
  ChevronRight,
  Music2,
  TrendingUp,
  Users,
  Bell,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { usePlayer } from '@/context/PlayerContext';
import { MOCK_PLAYLISTS, MOCK_ARTISTS, MOCK_SONGS, type ISong } from '@/data/music';
import { formatPlayCount } from '@/lib/utils';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { playPlaylist, playSong } = usePlayer();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handlePlayAll = () => {
    const songs: ISong[] = [];
    MOCK_PLAYLISTS.forEach((p) => {
      p.songIds.forEach((sid) => {
        const song = MOCK_SONGS.find((s) => s.id === sid);
        if (song && !songs.find((s) => s.id === song.id)) {
          songs.push(song);
        }
      });
    });
    if (songs.length > 0) {
      playPlaylist(songs);
    }
  };

  const handlePlaylistClick = (id: string) => {
    navigate(`/playlist/${id}`);
  };

  const handleArtistClick = (id: string) => {
    navigate(`/artist/${id}`);
  };

  const handlePlayPlaylist = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    const playlist = MOCK_PLAYLISTS.find((p) => p.id === playlistId);
    if (!playlist) return;
    const songs = playlist.songIds
      .map((sid) => MOCK_SONGS.find((s) => s.id === sid))
      .filter(Boolean) as ISong[];
    if (songs.length > 0) {
      playPlaylist(songs);
    }
  };

  const handlePlaySong = (e: React.MouseEvent, song: ISong) => {
    e.stopPropagation();
    const allSongs = MOCK_SONGS;
    playSong(song, allSongs);
  };

  // 推荐新歌（取前6首）
  const newSongs = MOCK_SONGS.slice(0, 6);

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-primary/5">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索歌曲、歌手、专辑..."
                className="pl-9 h-9 bg-white/5 border-white/10 rounded-full text-sm focus:border-primary/50"
              />
            </form>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-white/10 text-muted-foreground">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-white/10 text-muted-foreground relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 pb-28">
        {/* Banner 区域 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden group">
            <Image
              src="/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkiohtb32mu_ve_miaoda"
              alt="Banner"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

            <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium backdrop-blur-sm">
                  精选推荐
                </span>
                <span className="text-xs text-muted-foreground">每日更新</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
                发现你的
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {' '}专属旋律
                </span>
              </h1>
              <p className="text-sm text-muted-foreground mb-5">
                基于你的听歌偏好，为你精选每日推荐歌单
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayAll}
                  className="h-10 px-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium shadow-lg shadow-primary/30"
                >
                  <Play className="w-4 h-4 mr-1.5 fill-current" />
                  立即播放
                </Button>
                <Button
                  variant="outline"
                  className="h-10 px-5 rounded-full bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:border-white/20"
                >
                  查看更多
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 推荐歌单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">推荐歌单</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-white/5 h-8"
              onClick={() => navigate('/my-music')}
            >
              更多 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {MOCK_PLAYLISTS.map((playlist, i) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg shadow-black/20">
                  <Image
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

                  {/* 播放按钮 */}
                  <div
                    className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105"
                    onClick={(e) => handlePlayPlaylist(e, playlist.id)}
                  >
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  </div>

                  {/* 播放量 */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
                    <Play className="w-3 h-3 text-white/80 fill-current" />
                    <span className="text-[11px] text-white/90 font-medium">
                      {formatPlayCount(playlist.playCount)}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {playlist.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {playlist.creator}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 热门歌手 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-semibold text-foreground">热门歌手</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-white/5 h-8"
              onClick={() => navigate('/rank')}
            >
              更多 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {MOCK_ARTISTS.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer text-center"
                onClick={() => handleArtistClick(artist.id)}
              >
                <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2.5 shadow-lg shadow-black/20 ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-300">
                  <Image
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {artist.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatPlayCount(artist.followers)} 粉丝
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 最新音乐 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">最新音乐</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-white/5 h-8"
              onClick={() => navigate('/rank')}
            >
              更多 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {newSongs.map((song, i) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                onClick={() => playSong(song, MOCK_SONGS)}
              >
                <div className="relative shrink-0">
                  <Image
                    src={song.cover}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {song.title}
                  </h4>
                  <p
                    className="text-xs text-muted-foreground truncate hover:text-secondary transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/artist/${song.artistId}`);
                    }}
                  >
                    {song.artist}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {Math.floor(song.duration / 60)}:
                  {Math.floor(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
