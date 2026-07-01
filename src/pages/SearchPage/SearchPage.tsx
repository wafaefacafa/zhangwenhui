import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, User, Disc, ListMusic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import {
  MOCK_SONGS,
  MOCK_ARTISTS,
  MOCK_ALBUMS,
  MOCK_PLAYLISTS,
  type ISong,
  type IArtist,
  type IAlbum,
  type IPlaylist,
} from '@/data/music';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';

type TabValue = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const navigate = useNavigate();
  const { playSong, queue } = usePlayer();

  const filteredSongs = useMemo(() => {
    if (!keyword.trim()) return MOCK_SONGS;
    const kw = keyword.toLowerCase();
    return MOCK_SONGS.filter(
      (s) =>
        s.title.toLowerCase().includes(kw) ||
        s.artist.toLowerCase().includes(kw) ||
        s.album.toLowerCase().includes(kw)
    );
  }, [keyword]);

  const filteredArtists = useMemo(() => {
    if (!keyword.trim()) return MOCK_ARTISTS;
    const kw = keyword.toLowerCase();
    return MOCK_ARTISTS.filter((a) => a.name.toLowerCase().includes(kw));
  }, [keyword]);

  const filteredAlbums = useMemo(() => {
    if (!keyword.trim()) return MOCK_ALBUMS;
    const kw = keyword.toLowerCase();
    return MOCK_ALBUMS.filter(
      (a) => a.title.toLowerCase().includes(kw) || a.artist.toLowerCase().includes(kw)
    );
  }, [keyword]);

  const filteredPlaylists = useMemo(() => {
    if (!keyword.trim()) return MOCK_PLAYLISTS;
    const kw = keyword.toLowerCase();
    return MOCK_PLAYLISTS.filter(
      (p) => p.title.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw)
    );
  }, [keyword]);

  const handlePlaySong = (song: ISong) => {
    const fullQueue = filteredSongs.length > 0 ? filteredSongs : queue;
    playSong(song, fullQueue);
  };

  const renderSongs = () => (
    <div className="space-y-1">
      {filteredSongs.length === 0 ? (
        <EmptyState icon={<Music className="w-10 h-10" />} text="暂无匹配的歌曲" />
      ) : (
        filteredSongs.map((song, index) => (
          <div
            key={song.id}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => handlePlaySong(song)}
          >
            <span className="w-6 text-center text-sm text-muted-foreground tabular-nums shrink-0">
              {index + 1}
            </span>
            <Image
              src={song.cover}
              alt={song.title}
              className="w-10 h-10 rounded object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground truncate font-medium">{song.title}</div>
              <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
            </div>
            <span className="text-xs text-muted-foreground truncate hidden sm:block w-32">
              {song.album}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
              {formatDuration(song.duration)}
            </span>
          </div>
        ))
      )}
    </div>
  );

  const renderArtists = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {filteredArtists.length === 0 ? (
        <div className="col-span-full">
          <EmptyState icon={<User className="w-10 h-10" />} text="暂无匹配的歌手" />
        </div>
      ) : (
        filteredArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))
      )}
    </div>
  );

  const renderAlbums = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {filteredAlbums.length === 0 ? (
        <div className="col-span-full">
          <EmptyState icon={<Disc className="w-10 h-10" />} text="暂无匹配的专辑" />
        </div>
      ) : (
        filteredAlbums.map((album) => <AlbumCard key={album.id} album={album} />)
      )}
    </div>
  );

  const renderPlaylists = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {filteredPlaylists.length === 0 ? (
        <div className="col-span-full">
          <EmptyState icon={<ListMusic className="w-10 h-10" />} text="暂无匹配的歌单" />
        </div>
      ) : (
        filteredPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-6 pb-28">
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索歌曲、歌手、专辑、歌单"
              className="pl-12 h-12 bg-card/50 border-white/10 rounded-full text-base focus-visible:ring-primary/50"
            />
          </div>
        </div>

        {/* 分类 Tab */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="mb-6">
          <TabsList className="bg-transparent h-10 gap-1 border-b border-white/5 rounded-none w-full justify-start p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none relative h-10 px-4 rounded-none text-sm font-medium"
            >
              全部
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full data-[state=inactive]:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value="songs"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none relative h-10 px-4 rounded-none text-sm font-medium"
            >
              歌曲
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full data-[state=inactive]:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value="artists"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none relative h-10 px-4 rounded-none text-sm font-medium"
            >
              歌手
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full data-[state=inactive]:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none relative h-10 px-4 rounded-none text-sm font-medium"
            >
              专辑
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full data-[state=inactive]:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value="playlists"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none relative h-10 px-4 rounded-none text-sm font-medium"
            >
              歌单
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full data-[state=inactive]:hidden" />
            </TabsTrigger>
          </TabsList>

          {/* 内容区 */}
          <div className="space-y-8 mt-6">
            <TabsContent value="all" className="mt-0 space-y-10">
            {keyword && filteredSongs.length === 0 && filteredArtists.length === 0 && filteredAlbums.length === 0 && filteredPlaylists.length === 0 ? (
              <EmptyState icon={<Search className="w-12 h-12" />} text={`未找到与"${keyword}"相关的结果`} />
            ) : (
              <>
                {filteredSongs.length > 0 && (
                  <section>
                    <SectionTitle
                      title="歌曲"
                      action={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground h-7"
                          onClick={() => setActiveTab('songs')}
                        >
                          查看全部
                        </Button>
                      }
                    />
                    <div className="mt-3">{renderSongs()}</div>
                  </section>
                )}

                {filteredArtists.length > 0 && (
                  <section>
                    <SectionTitle
                      title="歌手"
                      action={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground h-7"
                          onClick={() => setActiveTab('artists')}
                        >
                          查看全部
                        </Button>
                      }
                    />
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {filteredArtists.slice(0, 6).map((artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                    </div>
                  </section>
                )}

                {filteredAlbums.length > 0 && (
                  <section>
                    <SectionTitle
                      title="专辑"
                      action={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground h-7"
                          onClick={() => setActiveTab('albums')}
                        >
                          查看全部
                        </Button>
                      }
                    />
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {filteredAlbums.slice(0, 6).map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                    </div>
                  </section>
                )}

                {filteredPlaylists.length > 0 && (
                  <section>
                    <SectionTitle
                      title="歌单"
                      action={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground h-7"
                          onClick={() => setActiveTab('playlists')}
                        >
                          查看全部
                        </Button>
                      }
                    />
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {filteredPlaylists.slice(0, 6).map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
            </TabsContent>

            <TabsContent value="songs" className="mt-0">
              {renderSongs()}
            </TabsContent>

            <TabsContent value="artists" className="mt-0">
              {renderArtists()}
            </TabsContent>

            <TabsContent value="albums" className="mt-0">
              {renderAlbums()}
            </TabsContent>

            <TabsContent value="playlists" className="mt-0">
              {renderPlaylists()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

function ArtistCard({ artist }: { artist: IArtist }) {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <Image
          src={artist.avatar}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-sm font-medium text-foreground truncate text-center">{artist.name}</div>
      <div className="text-xs text-muted-foreground truncate text-center mt-0.5">
        {(artist.followers / 10000).toFixed(1)}万 粉丝
      </div>
    </div>
  );
}

function AlbumCard({ album }: { album: IAlbum }) {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/album/${album.id}`)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
        <Image
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Music className="w-4 h-4 text-foreground ml-0.5" />
          </div>
        </div>
      </div>
      <div className="text-sm font-medium text-foreground truncate">{album.title}</div>
      <div className="text-xs text-muted-foreground truncate mt-0.5">{album.artist}</div>
    </div>
  );
}

function PlaylistCard({ playlist }: { playlist: IPlaylist }) {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/playlist/${playlist.id}`)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
        <Image
          src={playlist.cover}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Music className="w-4 h-4 text-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="text-sm font-medium text-foreground truncate">{playlist.title}</div>
      <div className="text-xs text-muted-foreground truncate mt-0.5">
        {(playlist.playCount / 10000).toFixed(1)}万 播放
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="mb-3 opacity-40">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}
