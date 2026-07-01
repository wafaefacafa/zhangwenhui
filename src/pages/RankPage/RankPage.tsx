import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import { Search, Flame, Medal, Play, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MOCK_RANKS, type IRank } from '@/data/rank';
import { usePlayer } from '@/context/PlayerContext';
import { MOCK_SONGS } from '@/data/music';

const RANK_TABS = [
  { value: 'leader', label: '领榜' },
  { value: 'hot', label: '热歌榜' },
  { value: 'new', label: '新歌榜' },
  { value: 'original', label: '原创榜' },
];

function getHotBadgeVariant(level: number) {
  if (level >= 3) return 'destructive';
  if (level >= 2) return 'default';
  return 'secondary';
}

function getHotLabel(level: number) {
  if (level >= 3) return '爆';
  if (level >= 2) return '热';
  return '新';
}

function getRankColor(rank: number) {
  if (rank === 1) return 'text-[#F59E0B]';
  if (rank === 2) return 'text-[#94A3B8]';
  if (rank === 3) return 'text-[#CD7F32]';
  return 'text-muted-foreground';
}

export default function RankPage() {
  const [activeTab, setActiveTab] = useState('leader');
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  const filteredRanks = useMemo(() => {
    if (!keyword.trim()) return MOCK_RANKS;
    const kw = keyword.toLowerCase();
    return MOCK_RANKS.filter(
      (r) => r.title.toLowerCase().includes(kw) || r.artist.toLowerCase().includes(kw)
    );
  }, [keyword, activeTab]);

  const handlePlay = (rank: IRank) => {
    const matched = MOCK_SONGS.find((s) => s.id === rank.id);
    if (matched) {
      playSong(matched, MOCK_SONGS);
    } else {
      // fallback: 用 mock 第一首
      playSong(MOCK_SONGS[0], MOCK_SONGS);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 lg:px-8 py-6 pb-28">
        {/* 顶部标题 + 搜索 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">排行榜</h1>
            <p className="text-sm text-muted-foreground mt-1">发现当下最热门的音乐</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="搜索歌曲或歌手"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 bg-card/50 border-border/50 focus-visible:ring-primary/50"
            />
          </div>
        </div>

        <Card className="bg-card/40 backdrop-blur-sm border-border/40">
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/50 p-1 h-10">
                {RANK_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground h-8 px-5"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-4">
            {/* 表头 */}
            <div className="grid grid-cols-[40px_56px_1fr_120px_100px_80px] gap-3 px-3 py-2 text-xs text-muted-foreground border-b border-border/40">
              <div className="text-center">排名</div>
              <div></div>
              <div>歌曲</div>
              <div>歌手</div>
              <div className="text-center">热度</div>
              <div className="text-right pr-2">操作</div>
            </div>

            {/* 排行列表 */}
            <div className="mt-2">
              {filteredRanks.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[40px_56px_1fr_120px_100px_80px] gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  {/* 排名 */}
                  <div className="text-center">
                    {item.rank <= 3 ? (
                      <div className="flex items-center justify-center">
                        <Medal className={`w-5 h-5 ${getRankColor(item.rank)}`} />
                      </div>
                    ) : (
                      <span className={`text-sm font-semibold ${getRankColor(item.rank)}`}>
                        {item.rank}
                      </span>
                    )}
                  </div>

                  {/* 封面 */}
                  <div className="relative">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      className="w-11 h-11 rounded-md object-cover"
                    />
                    <button
                      onClick={() => handlePlay(item)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </button>
                  </div>

                  {/* 歌曲信息 */}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {item.playCount} 播放
                    </div>
                  </div>

                  {/* 歌手 */}
                  <div
                    className="text-sm text-muted-foreground hover:text-secondary cursor-pointer truncate transition-colors"
                    onClick={() => navigate(`/artist/${item.artistId}`)}
                  >
                    {item.artist}
                  </div>

                  {/* 热度 */}
                  <div className="flex items-center justify-center gap-1">
                    <Badge
                      variant={getHotBadgeVariant(item.hotLevel) as any}
                      className="text-[11px] px-2 py-0 h-5"
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      {getHotLabel(item.hotLevel)}
                    </Badge>
                  </div>

                  {/* 操作 */}
                  <div className="flex items-center justify-end gap-1 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                      onClick={() => handlePlay(item)}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border/30">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-white/10 text-muted-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
              >
                1
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-white/10 text-muted-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
