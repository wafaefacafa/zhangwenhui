import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { MOCK_USERS } from '@/data/user';
import { MOCK_PLAYLISTS } from '@/data/music';
import {
  Edit3,
  ChevronRight,
  Music2,
  Clock,
  Headphones,
  TrendingUp,
  Star,
  CalendarDays,
  Heart,
  ListMusic,
  Play,
} from 'lucide-react';

const STATS_DATA = [
  { label: '电子音乐', value: '89:50', percent: 75 },
  { label: '流行音乐', value: '52:30', percent: 52 },
  { label: '民谣吉他', value: '41:20', percent: 41 },
  { label: '古典乐', value: '18:40', percent: 18 },
];

const PLAYBACK_DATA = [
  85, 120, 65, 160, 90, 40, 180, 110, 190, 95, 130, 75, 100,
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = MOCK_USERS[0];
  const createdPlaylists = MOCK_PLAYLISTS.slice(0, 4);
  const favoritedPlaylists = MOCK_PLAYLISTS.slice(2, 5);

  const handleEditProfile = () => {
    toast.info('编辑资料功能开发中');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="p-6 pb-28 space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* 第一行：用户信息 + 数据统计 + 最近播放 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 用户信息卡片 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-primary to-secondary">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover border-2 border-card"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white border-2 border-card">
                    {user.level}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {user.username}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  音乐探索者 · Lv.{user.level}
                </p>
                <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-foreground">
                      {user.level}
                    </span>
                    <span className="text-xs text-muted-foreground">等级</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-border/50">
                    <span className="text-lg font-bold text-foreground">
                      {user.followingCount}
                    </span>
                    <span className="text-xs text-muted-foreground">关注</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-foreground">
                      {user.followerCount}
                    </span>
                    <span className="text-xs text-muted-foreground">粉丝</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 数据统计卡片 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  数据统计
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {STATS_DATA.map((stat, index) => (
                  <div key={stat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percent}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.3 + index * 0.1,
                          ease: 'easeOut',
                        }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* 最近播放记录卡片 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  最近播放记录
                </CardTitle>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleEditProfile}
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  编辑资料
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-1 h-36 pt-2">
                  {PLAYBACK_DATA.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + i * 0.05,
                        ease: 'easeOut',
                      }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary/60 to-secondary/80 min-w-[6px] hover:from-primary hover:to-secondary transition-colors cursor-pointer"
                      title={`第 ${i + 1} 天: ${Math.round(value * 2)} 分钟`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>1天前</span>
                  <span>7天前</span>
                  <span>13天前</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 第二行：我创建的歌单 + 收藏的歌单 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 我创建的歌单 */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-primary" />
                  我创建的歌单
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10"
                >
                  查看全部
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {createdPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 shadow-md">
                        <Image
                          src={playlist.cover}
                          alt={playlist.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg">
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {playlist.creator}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 收藏的歌单 */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  收藏的歌单
                </CardTitle>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleEditProfile}
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  编辑资料
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {favoritedPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 shadow-md">
                        <Image
                          src={playlist.cover}
                          alt={playlist.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-secondary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg">
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-secondary transition-colors">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {playlist.playCount.toLocaleString()} 次播放
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 第三行：成就徽章 + 听歌偏好 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 成就徽章 */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  成就徽章
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: Music2, color: 'from-primary to-secondary', name: '初心' },
                    { icon: Headphones, color: 'from-purple-500 to-pink-500', name: '夜猫' },
                    { icon: CalendarDays, color: 'from-amber-500 to-orange-500', name: '连续' },
                    { icon: TrendingUp, color: 'from-emerald-500 to-teal-500', name: '探索' },
                    { icon: Heart, color: 'from-rose-500 to-red-500', name: '挚爱' },
                    { icon: Star, color: 'from-yellow-500 to-amber-500', name: '收藏' },
                    { icon: ListMusic, color: 'from-blue-500 to-indigo-500', name: '策展人' },
                    { icon: Clock, color: 'from-slate-400 to-slate-600', name: '未解锁', locked: true },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1.5 ${
                        badge.locked ? 'opacity-40' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-md`}
                      >
                        <badge.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 听歌偏好 */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-primary" />
                  听歌偏好分析
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  基于最近 30 天数据
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '最爱风格', value: '电子', sub: '38%', color: 'text-primary' },
                    { label: '最爱歌手', value: '林夜', sub: '28 首', color: 'text-secondary' },
                    { label: '听歌时段', value: '深夜', sub: '22:00-02:00', color: 'text-purple-400' },
                    { label: '总时长', value: '201h', sub: '本月累计', color: 'text-emerald-400' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-3 rounded-lg bg-muted/50 border border-border/30"
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className={`text-lg font-bold ${item.color}`}>
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
