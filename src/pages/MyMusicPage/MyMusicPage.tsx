import { useState, useMemo, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  Music2,
  Download,
  ListPlus,
  ListMusic,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import {
  MOCK_SONGS,
  MOCK_PLAYLISTS,
  type ISong,
  type IPlaylist,
} from '@/data/music';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TABS = [
  { value: 'local', label: '本地音乐', icon: Music2 },
  { value: 'favorite', label: '我喜欢', icon: Heart },
  { value: 'download', label: '下载歌曲', icon: Download },
  { value: 'created', label: '创建的歌单', icon: ListPlus },
  { value: 'collected', label: '收藏的歌单', icon: ListMusic },
] as const;

type TabValue = (typeof TABS)[number]['value'];

export default function MyMusicPage() {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    favorites,
    playSong,
    togglePlay,
    toggleFavorite,
    playPlaylist,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<TabValue>('local');
  const [keyword, setKeyword] = useState('');

  // 不同 Tab 的数据源
  const songList = useMemo(() => {
    let list: ISong[] = [];
    if (activeTab === 'local') {
      list = MOCK_SONGS;
    } else if (activeTab === 'favorite') {
      list = MOCK_SONGS.filter((s) => favorites.includes(s.id));
    } else if (activeTab === 'download') {
      list = MOCK_SONGS.slice(0, 4);
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(kw) ||
          s.artist.toLowerCase().includes(kw) ||
          s.album.toLowerCase().includes(kw)
      );
    }
    return list;
  }, [activeTab, favorites, keyword]);

  const createdPlaylists = useMemo(
    () => MOCK_PLAYLISTS.slice(0, 3),
    []
  );
  const collectedPlaylists = useMemo(
    () => MOCK_PLAYLISTS.slice(3, 6),
    []
  );

  const handlePlaySong = (song: ISong) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, songList);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const isCurrentSong = (id: string) => currentSong?.id === id;

  return (
    <div className="min-h-full bg-background p-6 pb-28">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">我的音乐</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理你的本地音乐、收藏与歌单
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
          className="w-full"
        >
          <TabsList className="bg-card/50 h-10 p-1 gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-8 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* 本地音乐 */}
          <TabsContent value="local" className="mt-6 space-y-4">
              {/* 搜索栏 */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    value={keyword}
                    onChange={handleSearchChange}
                    placeholder="搜索歌曲、歌手或专辑"
                    className="pl-9 bg-card/50 border-border/50 h-10 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-10 bg-card/50 border border-border/50 hover:bg-card/80"
                  onClick={() => {
                    if (songList.length > 0) {
                      playSong(songList[0], songList);
                    }
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  播放全部
                </Button>
              </div>

              {/* 歌曲列表 */}
              <div className="bg-card/30 rounded-xl border border-border/30 overflow-hidden">
                {/* 表头 */}
                <div className="grid grid-cols-[40px_60px_1fr_1fr_1fr_100px_80px] gap-4 px-4 py-3 text-xs text-muted-foreground border-b border-border/30 bg-card/20">
                  <div className="text-center">#</div>
                  <div></div>
                  <div>歌曲</div>
                  <div>歌手</div>
                  <div>专辑</div>
                  <div className="text-right">时长</div>
                  <div className="text-center">操作</div>
                </div>

                {/* 列表内容 */}
                {songList.length === 0 ? (
                  <div className="py-20 text-center text-muted-foreground">
                    <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">暂无歌曲</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {songList.map((song, index) => {
                      const isCurrent = isCurrentSong(song.id);
                      const isFav = favorites.includes(song.id);
                      return (
                        <div
                          key={song.id}
                          className={cn(
                            'grid grid-cols-[40px_60px_1fr_1fr_1fr_100px_80px] gap-4 px-4 py-2.5 items-center group hover:bg-card/50 transition-colors cursor-pointer',
                            isCurrent && 'bg-primary/10'
                          )}
                          onDoubleClick={() => handlePlaySong(song)}
                        >
                          {/* 序号 / 播放按钮 */}
                          <div className="text-center">
                            <span
                              className={cn(
                                'text-sm tabular-nums transition-opacity group-hover:opacity-0',
                                isCurrent
                                  ? 'text-primary font-medium'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {index + 1}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={cn(
                                'absolute -mt-5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10',
                                isCurrent && 'opacity-100'
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlaySong(song);
                              }}
                            >
                              {isCurrent && isPlaying ? (
                                <Pause className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-foreground" />
                              )}
                            </Button>
                          </div>

                          {/* 封面 */}
                          <div className="relative">
                            <Image
                              src={song.cover}
                              alt={song.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          </div>

                          {/* 歌名 */}
                          <div className="min-w-0">
                            <div
                              className={cn(
                                'text-sm font-medium truncate',
                                isCurrent
                                  ? 'text-primary'
                                  : 'text-foreground'
                              )}
                            >
                              {song.title}
                            </div>
                          </div>

                          {/* 歌手 */}
                          <div
                            className="text-sm text-muted-foreground truncate hover:text-secondary cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/artist/${song.artistId}`);
                            }}
                          >
                            {song.artist}
                          </div>

                          {/* 专辑 */}
                          <div
                            className="text-sm text-muted-foreground truncate hover:text-secondary cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/album/${song.albumId}`);
                            }}
                          >
                            {song.album}
                          </div>

                          {/* 时长 */}
                          <div className="text-sm text-muted-foreground text-right tabular-nums">
                            {formatDuration(song.duration)}
                          </div>

                          {/* 操作 */}
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className={cn(
                                'h-7 w-7 hover:bg-white/10',
                                isFav &&
                                  'text-destructive opacity-100'
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(song.id);
                              }}
                              title={isFav ? '取消喜欢' : '添加到我喜欢'}
                            >
                              <Heart
                                className={cn(
                                  'w-3.5 h-3.5',
                                  isFav && 'fill-current'
                                )}
                              />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                              title="添加到歌单"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                              title="更多"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
           </TabsContent>

           {/* 我喜欢 */}
           <TabsContent value="favorite" className="mt-6 space-y-4">
             {/* 搜索栏 */}
             <div className="flex items-center gap-3">
               <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                 <Input
                   type="search"
                   value={keyword}
                   onChange={handleSearchChange}
                   placeholder="搜索歌曲、歌手或专辑"
                   className="pl-9 bg-card/50 border-border/50 h-10 focus-visible:ring-primary"
                 />
               </div>
               <Button
                 variant="secondary"
                 size="sm"
                 className="h-10 bg-card/50 border border-border/50 hover:bg-card/80"
                 onClick={() => {
                   if (songList.length > 0) {
                     playSong(songList[0], songList);
                   }
                 }}
               >
                 <Play className="w-4 h-4 mr-2" />
                 播放全部
               </Button>
             </div>

             {/* 歌曲列表 */}
             <div className="bg-card/30 rounded-xl border border-border/30 overflow-hidden">
               {/* 表头 */}
               <div className="grid grid-cols-[40px_60px_1fr_1fr_1fr_100px_80px] gap-4 px-4 py-3 text-xs text-muted-foreground border-b border-border/30 bg-card/20">
                 <div className="text-center">#</div>
                 <div></div>
                 <div>歌曲</div>
                 <div>歌手</div>
                 <div>专辑</div>
                 <div className="text-right">时长</div>
                 <div className="text-center">操作</div>
               </div>

               {/* 列表内容 */}
               {songList.length === 0 ? (
                 <div className="py-20 text-center text-muted-foreground">
                   <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                   <p className="text-sm">暂无歌曲</p>
                 </div>
               ) : (
                 <div className="divide-y divide-border/20">
                   {songList.map((song, index) => {
                     const isCurrent = isCurrentSong(song.id);
                     const isFav = favorites.includes(song.id);
                     return (
                       <div
                         key={song.id}
                         className={cn(
                           'grid grid-cols-[40px_60px_1fr_1fr_1fr_100px_80px] gap-4 px-4 py-2.5 items-center group hover:bg-card/50 transition-colors cursor-pointer',
                           isCurrent && 'bg-primary/10'
                         )}
                         onDoubleClick={() => handlePlaySong(song)}
                       >
                         {/* 序号 / 播放按钮 */}
                         <div className="text-center">
                           <span
                             className={cn(
                               'text-sm tabular-nums transition-opacity group-hover:opacity-0',
                               isCurrent
                                 ? 'text-primary font-medium'
                                 : 'text-muted-foreground'
                             )}
                           >
                             {index + 1}
                           </span>
                           <Button
                             size="icon"
                             variant="ghost"
                             className={cn(
                               'absolute -mt-5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10',
                               isCurrent && 'opacity-100'
                             )}
                             onClick={(e) => {
                               e.stopPropagation();
                               handlePlaySong(song);
                             }}
                           >
                             {isCurrent && isPlaying ? (
                               <Pause className="w-3.5 h-3.5 text-primary" />
                             ) : (
                               <Play className="w-3.5 h-3.5 text-foreground" />
                             )}
                           </Button>
                         </div>

                         {/* 封面 */}
                         <div className="relative">
                           <Image
                             src={song.cover}
                             alt={song.title}
                             className="w-10 h-10 rounded object-cover"
                           />
                         </div>

                         {/* 歌名 */}
                         <div className="min-w-0">
                           <div className="text-sm font-medium text-foreground truncate">
                             {song.title}
                           </div>
                         </div>

                         {/* 歌手 */}
                         <div className="min-w-0">
                           <div className="text-sm text-muted-foreground truncate hover:text-foreground transition-colors cursor-pointer">
                             {song.artist}
                           </div>
                         </div>

                         {/* 专辑 */}
                         <div className="min-w-0">
                           <div className="text-sm text-muted-foreground truncate">
                             {song.album}
                           </div>
                         </div>

                         {/* 时长 */}
                         <div className="text-right">
                           <span className="text-sm text-muted-foreground tabular-nums">
                             {formatDuration(song.duration)}
                           </span>
                         </div>

                         {/* 操作 */}
                         <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button
                             size="icon"
                             variant="ghost"
                             className={cn(
                               'h-7 w-7 hover:bg-white/10',
                               isFav ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                             )}
                             title={isFav ? '取消收藏' : '收藏'}
                             onClick={(e) => {
                               e.stopPropagation();
                               toggleFavorite(song.id);
                             }}
                           >
                             <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-current')} />
                           </Button>
                           <Button
                             size="icon"
                             variant="ghost"
                             className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                             title="更多"
                             onClick={(e) => e.stopPropagation()}
                           >
                             <MoreHorizontal className="w-3.5 h-3.5" />
                           </Button>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
             </div>
           </TabsContent>

           {/* 下载歌曲 */}
           <TabsContent value="download" className="mt-6 space-y-4">
             {/* 搜索栏 */}
             <div className="flex items-center gap-3">
               <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                 <Input
                   type="search"
                   value={keyword}
                   onChange={handleSearchChange}
                   placeholder="搜索歌曲、歌手或专辑"
                   className="pl-9 bg-card/50 border-border/50 h-10 focus-visible:ring-primary"
                 />
               </div>
               <Button
                 variant="secondary"
                 size="sm"
                 className="h-10 bg-card/50 border border-border/50 hover:bg-card/80"
                 onClick={() => {
                   if (songList.length > 0) {
                     playSong(songList[0], songList);
                   }
                 }}
               >
                 <Play className="w-4 h-4 mr-2" />
                 播放全部
               </Button>
             </div>

             {/* 歌曲列表 */}
             <div className="bg-card/30 rounded-xl border border-border/30 overflow-hidden">
               {/* 表头 */}
               <div className="grid grid-cols-[40px_60px_1fr_1fr_1fr_100px_80px] gap-4 px-4 py-3 text-xs text-muted-foreground border-b border-border/30 bg-card/20">
                 <div className="text-center">#</div>
                 <div></div>
                 <div>歌曲</div>
                 <div>歌手</div>
                 <div>专辑</div>
                 <div className="text-right">时长</div>
                 <div className="text-center">操作</div>
               </div>

               {/* 列表内容 */}
               {songList.length === 0 ? (
                 <div className="py-20 text-center text-muted-foreground">
                   <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                   <p className="text-sm">暂无歌曲</p>
                 </div>
               ) : (
                 <div className="divide-y divide-border/20">
                   {songList.map((song, index) => {
                     const isCurrent = isCurrentSong(song.id);
                     const isFav = favorites.includes(song.id);
                     return (
                       <div
                         key={song.id}
                         className={cn(
                           'grid grid-cols-[40px_60px_1fr_1fr_1fr_100px_80px] gap-4 px-4 py-2.5 items-center group hover:bg-card/50 transition-colors cursor-pointer',
                           isCurrent && 'bg-primary/10'
                         )}
                         onDoubleClick={() => handlePlaySong(song)}
                       >
                         {/* 序号 / 播放按钮 */}
                         <div className="text-center">
                           <span
                             className={cn(
                               'text-sm tabular-nums transition-opacity group-hover:opacity-0',
                               isCurrent
                                 ? 'text-primary font-medium'
                                 : 'text-muted-foreground'
                             )}
                           >
                             {index + 1}
                           </span>
                           <Button
                             size="icon"
                             variant="ghost"
                             className={cn(
                               'absolute -mt-5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10',
                               isCurrent && 'opacity-100'
                             )}
                             onClick={(e) => {
                               e.stopPropagation();
                               handlePlaySong(song);
                             }}
                           >
                             {isCurrent && isPlaying ? (
                               <Pause className="w-3.5 h-3.5 text-primary" />
                             ) : (
                               <Play className="w-3.5 h-3.5 text-foreground" />
                             )}
                           </Button>
                         </div>

                         {/* 封面 */}
                         <div className="relative">
                           <Image
                             src={song.cover}
                             alt={song.title}
                             className="w-10 h-10 rounded object-cover"
                           />
                         </div>

                         {/* 歌名 */}
                         <div className="min-w-0">
                           <div className="text-sm font-medium text-foreground truncate">
                             {song.title}
                           </div>
                         </div>

                         {/* 歌手 */}
                         <div className="min-w-0">
                           <div className="text-sm text-muted-foreground truncate hover:text-foreground transition-colors cursor-pointer">
                             {song.artist}
                           </div>
                         </div>

                         {/* 专辑 */}
                         <div className="min-w-0">
                           <div className="text-sm text-muted-foreground truncate">
                             {song.album}
                           </div>
                         </div>

                         {/* 时长 */}
                         <div className="text-right">
                           <span className="text-sm text-muted-foreground tabular-nums">
                             {formatDuration(song.duration)}
                           </span>
                         </div>

                         {/* 操作 */}
                         <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button
                             size="icon"
                             variant="ghost"
                             className={cn(
                               'h-7 w-7 hover:bg-white/10',
                               isFav ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                             )}
                             title={isFav ? '取消收藏' : '收藏'}
                             onClick={(e) => {
                               e.stopPropagation();
                               toggleFavorite(song.id);
                             }}
                           >
                             <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-current')} />
                           </Button>
                           <Button
                             size="icon"
                             variant="ghost"
                             className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                             title="更多"
                             onClick={(e) => e.stopPropagation()}
                           >
                             <MoreHorizontal className="w-3.5 h-3.5" />
                           </Button>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
             </div>
           </TabsContent>

           {/* 创建的歌单 */}
          <TabsContent value="created" className="mt-6">
            <PlaylistGrid
              playlists={createdPlaylists}
              onPlay={playPlaylist}
              onOpen={(id) => navigate(`/playlist/${id}`)}
            />
          </TabsContent>

          {/* 收藏的歌单 */}
          <TabsContent value="collected" className="mt-6">
            <PlaylistGrid
              playlists={collectedPlaylists}
              onPlay={playPlaylist}
              onOpen={(id) => navigate(`/playlist/${id}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface PlaylistGridProps {
  playlists: IPlaylist[];
  onPlay: (songs: ISong[]) => void;
  onOpen: (id: string) => void;
}

function PlaylistGrid({ playlists, onPlay, onOpen }: PlaylistGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {playlists.map((pl) => {
        const songs = pl.songIds
          .map((id) => MOCK_SONGS.find((s) => s.id === id))
          .filter(Boolean) as ISong[];
        return (
          <div
            key={pl.id}
            className="group cursor-pointer"
            onClick={() => onOpen(pl.id)}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg shadow-black/20">
              <Image
                src={pl.cover}
                alt={pl.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Button
                size="icon"
                className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(songs);
                }}
              >
                <Play className="w-5 h-5 ml-0.5" />
              </Button>
            </div>
            <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {pl.title}
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {pl.creator} · {pl.songIds.length} 首
            </div>
          </div>
        );
      })}
    </div>
  );
}
