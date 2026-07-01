import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Pause,
  Play,
  FolderOpen,
  Music2,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { toast } from 'sonner';
import { MOCK_DOWNLOADS, type IDownloadTask } from '@/data/downloads';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<IDownloadTask['status'], string> = {
  downloading: '下载中',
  paused: '已暂停',
  completed: '已完成',
  error: '失败',
};

const STATUS_COLORS: Record<IDownloadTask['status'], string> = {
  downloading: 'text-secondary',
  paused: 'text-muted-foreground',
  completed: 'text-success',
  error: 'text-destructive',
};

export default function DownloadPage() {
  const [tasks, setTasks] = useState<IDownloadTask[]>(MOCK_DOWNLOADS);
  const [activeTab, setActiveTab] = useState<'all' | 'downloading' | 'completed' | 'error'>('all');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('time');

  // 整体下载进度
  const overallProgress = useMemo(() => {
    const activeTasks = tasks.filter((t) => t.status === 'downloading' || t.status === 'paused');
    if (activeTasks.length === 0) return 100;
    const total = activeTasks.reduce((sum, t) => sum + t.progress, 0);
    return Math.round(total / activeTasks.length);
  }, [tasks]);

  // 统计数据
  const stats = useMemo(() => {
    const downloading = tasks.filter((t) => t.status === 'downloading').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const paused = tasks.filter((t) => t.status === 'paused').length;
    const error = tasks.filter((t) => t.status === 'error').length;
    return { downloading, completed, paused, error, total: tasks.length };
  }, [tasks]);

  // 过滤任务
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (activeTab !== 'all') {
      result = result.filter((t) => t.status === activeTab);
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(kw) || t.artist.toLowerCase().includes(kw)
      );
    }
    if (sortBy === 'time') {
      result = [...result].sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === 'progress') {
      result = [...result].sort((a, b) => b.progress - a.progress);
    }
    return result;
  }, [tasks, activeTab, keyword, sortBy]);

  const togglePause = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === 'downloading') {
          toast.info(`已暂停：${t.title}`);
          return { ...t, status: 'paused' as const, speed: '0KB/s' };
        }
        if (t.status === 'paused') {
          toast.success(`继续下载：${t.title}`);
          return { ...t, status: 'downloading' as const, speed: `${(Math.random() * 3 + 1).toFixed(1)}MB/s` };
        }
        return t;
      })
    );
  };

  const retryDownload = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        toast.success(`重新下载：${t.title}`);
        return { ...t, status: 'downloading' as const, speed: '2.0MB/s', progress: 0 };
      })
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success('已删除下载任务');
  };

  const pauseAll = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.status === 'downloading' ? { ...t, status: 'paused' as const, speed: '0KB/s' } : t
      )
    );
    toast.info('已暂停全部下载');
  };

  const resumeAll = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.status === 'paused'
          ? { ...t, status: 'downloading' as const, speed: `${(Math.random() * 3 + 1).toFixed(1)}MB/s` }
          : t
      )
    );
    toast.success('已继续全部下载');
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 lg:p-8 space-y-6 pb-28">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Download className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">下载管理</h1>
            <p className="text-sm text-muted-foreground">
              共 {stats.total} 个任务 · 下载中 {stats.downloading} · 已完成 {stats.completed}
            </p>
          </div>
        </motion.div>

        {/* 下载进度总览 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">下载进度总览</h2>
              <p className="text-sm text-muted-foreground mt-1">
                平均进度 {overallProgress}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={pauseAll}
                className="bg-card hover:bg-muted text-foreground"
              >
                <Pause className="size-4 mr-1.5" />
                全部暂停
              </Button>
              <Button
                size="sm"
                onClick={resumeAll}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                <Play className="size-4 mr-1.5" />
                全部继续
              </Button>
            </div>
          </div>

          {/* 总进度条 */}
          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-sm"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* 状态统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl bg-background/50 p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Download className="size-4 text-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">下载中</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.downloading}</div>
            </div>
            <div className="rounded-xl bg-background/50 p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">已完成</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
            </div>
            <div className="rounded-xl bg-background/50 p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                  <Pause className="size-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">已暂停</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.paused}</div>
            </div>
            <div className="rounded-xl bg-background/50 p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="size-4 text-destructive" />
                </div>
                <span className="text-sm text-muted-foreground">失败</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.error}</div>
            </div>
          </div>
        </motion.div>

        {/* 筛选栏 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full sm:w-auto">
            <TabsList className="bg-card/50 border border-border/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                全部
              </TabsTrigger>
              <TabsTrigger value="downloading" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                下载中
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                已完成
              </TabsTrigger>
              <TabsTrigger value="error" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                失败
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索歌曲或歌手"
                className="bg-card/50 border-border/50 pl-9 focus:border-primary/50"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-card/50 border-border/50">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">按添加时间</SelectItem>
                <SelectItem value="progress">按进度</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* 下载列表 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm overflow-hidden"
        >
          {/* 表头 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border/50 bg-muted/20 text-xs font-medium text-muted-foreground">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">歌曲</div>
            <div className="col-span-2 hidden md:block">歌手</div>
            <div className="col-span-2 hidden lg:block">大小</div>
            <div className="col-span-2">进度 / 速率</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {/* 列表项 */}
          <div className="divide-y divide-border/30">
            {filteredTasks.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-muted-foreground">
                <Music2 className="size-12 mb-3 opacity-30" />
                <p>暂无下载任务</p>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="col-span-1 text-center">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                  </div>

                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Image
                        src={task.cover}
                        alt={task.title}
                        className="w-11 h-11 rounded-lg object-cover shadow-md"
                      />
                      {task.status === 'downloading' && (
                        <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                      {task.status === 'completed' && (
                        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-success flex items-center justify-center shadow-md">
                          <CheckCircle2 className="size-3 text-white" />
                        </div>
                      )}
                      {task.status === 'error' && (
                        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-destructive flex items-center justify-center shadow-md">
                          <AlertCircle className="size-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate md:hidden">
                        {task.artist}
                      </div>
                      <div className={cn('text-xs mt-0.5', STATUS_COLORS[task.status])}>
                        {STATUS_LABELS[task.status]}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 hidden md:block">
                    <span className="text-sm text-muted-foreground truncate block">
                      {task.artist}
                    </span>
                  </div>

                  <div className="col-span-2 hidden lg:block">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {task.size}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {task.progress}%
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {task.speed}
                      </span>
                    </div>
                    <div className="relative h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
                          task.status === 'error'
                            ? 'bg-destructive'
                            : task.status === 'completed'
                            ? 'bg-success'
                            : task.status === 'paused'
                            ? 'bg-muted-foreground/50'
                            : 'bg-gradient-to-r from-primary to-secondary'
                        )}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {(task.status === 'downloading' || task.status === 'paused') && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                        onClick={() => togglePause(task.id)}
                        title={task.status === 'downloading' ? '暂停' : '继续'}
                      >
                        {task.status === 'downloading' ? (
                          <Pause className="size-4" />
                        ) : (
                          <Play className="size-4" />
                        )}
                      </Button>
                    )}
                    {task.status === 'error' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-secondary"
                        onClick={() => retryDownload(task.id)}
                        title="重新下载"
                      >
                        <RefreshCw className="size-4" />
                      </Button>
                    )}
                    {task.status === 'completed' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                        onClick={() => toast.info('打开文件目录')}
                        title="打开文件"
                      >
                        <FolderOpen className="size-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeTask(task.id)}
                      title="删除"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
