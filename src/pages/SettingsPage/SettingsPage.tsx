import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Music,
  Palette,
  UserCircle,
  Info,
  Volume2,
  Shuffle,
  Repeat,
  Moon,
  Sun,
  Download,
  Globe,
  Bell,
  Headphones,
  Zap,
  Monitor,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { scopedStorage } from '@lark-apaas/client-toolkit-lite';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';

type SettingCategory = 'play' | 'appearance' | 'account' | 'about';

const STORAGE_KEY = '__harmony_settings';

interface Settings {
  autoPlay: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  defaultVolume: number;
  playMode: 'sequence' | 'loop' | 'random';
  soundQuality: 'standard' | 'high' | 'lossless';
  theme: 'dark' | 'light' | 'auto';
  accentColor: 'primary' | 'secondary' | 'purple' | 'cyan';
  showLyrics: boolean;
  lyricsFontSize: number;
  animationEnabled: boolean;
  language: 'zh-CN' | 'en-US';
  downloadPath: string;
  concurrentDownloads: number;
  autoDownload: boolean;
  notification: boolean;
  desktopLyrics: boolean;
  minimizeToTray: boolean;
  autoStart: boolean;
  hardwareAcceleration: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  autoPlay: true,
  crossfade: false,
  crossfadeDuration: 3,
  defaultVolume: 70,
  playMode: 'sequence',
  soundQuality: 'high',
  theme: 'dark',
  accentColor: 'primary',
  showLyrics: true,
  lyricsFontSize: 16,
  animationEnabled: true,
  language: 'zh-CN',
  downloadPath: '默认下载目录',
  concurrentDownloads: 3,
  autoDownload: false,
  notification: true,
  desktopLyrics: false,
  minimizeToTray: true,
  autoStart: false,
  hardwareAcceleration: true,
};

function loadSettings(): Settings {
  try {
    const raw = scopedStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings) {
  try {
    scopedStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

const CATEGORIES: { key: SettingCategory; label: string; icon: typeof Music }[] = [
  { key: 'play', label: '播放设置', icon: Music },
  { key: 'appearance', label: '外观设置', icon: Palette },
  { key: 'account', label: '账号设置', icon: UserCircle },
  { key: 'about', label: '关于我们', icon: Info },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('play');
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const { setVolume } = usePlayer();

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === 'defaultVolume') {
      setVolume(value as number);
    }
    toast.success('设置已保存');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部渐变光晕 */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">系统设置</h1>
          <p className="text-muted-foreground text-sm">自定义你的 Harmony Music 体验</p>
        </motion.div>

        <div className="flex gap-6">
          {/* 左侧一级导航 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-56 shrink-0"
          >
            <Card className="bg-card/60 backdrop-blur-sm border-white/5">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-secondary' : ''}`} />
                        <span>{cat.label}</span>
                        {isActive && (
                          <span className="ml-auto w-0.5 h-4 rounded-full bg-gradient-to-b from-primary to-secondary" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧设置面板 */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 min-w-0"
          >
            <Card className="bg-card/60 backdrop-blur-sm border-white/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">
                  {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeCategory === 'play' && (
                  <div className="space-y-6">
                    {/* 播放控制 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-secondary" />
                        播放控制
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">自动播放</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              启动应用时自动继续播放上次的音乐
                            </p>
                          </div>
                          <Switch
                            checked={settings.autoPlay}
                            onCheckedChange={(v) => updateSetting('autoPlay', v)}
                          />
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">淡入淡出</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              切换歌曲时平滑过渡，避免突兀
                            </p>
                          </div>
                          <Switch
                            checked={settings.crossfade}
                            onCheckedChange={(v) => updateSetting('crossfade', v)}
                          />
                        </div>
                        {settings.crossfade && (
                          <div className="pl-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-muted-foreground">淡入淡出时长</Label>
                              <span className="text-sm text-secondary tabular-nums">
                                {settings.crossfadeDuration} 秒
                              </span>
                            </div>
                            <Slider
                              value={[settings.crossfadeDuration]}
                              min={1}
                              max={10}
                              step={1}
                              onValueChange={([v]) => updateSetting('crossfadeDuration', v)}
                              className="w-48"
                            />
                          </div>
                        )}
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">默认播放模式</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              每次启动应用时的默认播放模式
                            </p>
                          </div>
                          <Select
                            value={settings.playMode}
                            onValueChange={(v) =>
                              updateSetting('playMode', v as Settings['playMode'])
                            }
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sequence">顺序播放</SelectItem>
                              <SelectItem value="loop">单曲循环</SelectItem>
                              <SelectItem value="random">随机播放</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 音量 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-secondary" />
                        音量设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground font-normal">默认音量</Label>
                            <span className="text-sm text-secondary tabular-nums">
                              {settings.defaultVolume}%
                            </span>
                          </div>
                          <Slider
                            value={[settings.defaultVolume]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={([v]) => updateSetting('defaultVolume', v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 音质 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-secondary" />
                        音质设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">在线播放音质</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              更高音质将消耗更多流量和存储空间
                            </p>
                          </div>
                          <Select
                            value={settings.soundQuality}
                            onValueChange={(v) =>
                              updateSetting('soundQuality', v as Settings['soundQuality'])
                            }
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">标准音质</SelectItem>
                              <SelectItem value="high">高品质</SelectItem>
                              <SelectItem value="lossless">无损音质</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'appearance' && (
                  <div className="space-y-6">
                    {/* 主题 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-secondary" />
                        主题设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">外观模式</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              选择应用的整体外观风格
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {(['dark', 'light', 'auto'] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => updateSetting('theme', mode)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                  settings.theme === mode
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30'
                                    : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                                }`}
                              >
                                {mode === 'dark' ? (
                                  <Moon className="w-3.5 h-3.5" />
                                ) : mode === 'light' ? (
                                  <Sun className="w-3.5 h-3.5" />
                                ) : (
                                  <Monitor className="w-3.5 h-3.5" />
                                )}
                                <span className="ml-1.5">
                                  {mode === 'dark' ? '深色' : mode === 'light' ? '浅色' : '跟随系统'}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">主题色</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              选择你喜欢的强调色
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {(['primary', 'secondary', 'purple', 'cyan'] as const).map((color) => (
                              <button
                                key={color}
                                onClick={() => updateSetting('accentColor', color)}
                                className={`w-8 h-8 rounded-full transition-all ${
                                  settings.accentColor === color
                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-card scale-110'
                                    : 'hover:scale-105'
                                } ${
                                  color === 'primary'
                                    ? 'bg-primary'
                                    : color === 'secondary'
                                    ? 'bg-secondary'
                                    : color === 'purple'
                                    ? 'bg-purple-500'
                                    : 'bg-cyan-400'
                                }`}
                                aria-label={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 歌词 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Palette className="w-4 h-4 text-secondary" />
                        歌词设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">显示歌词</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              在播放详情页显示滚动歌词
                            </p>
                          </div>
                          <Switch
                            checked={settings.showLyrics}
                            onCheckedChange={(v) => updateSetting('showLyrics', v)}
                          />
                        </div>
                        {settings.showLyrics && (
                          <>
                            <Separator className="bg-white/5" />
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-foreground font-normal">歌词字号</Label>
                                <span className="text-sm text-secondary tabular-nums">
                                  {settings.lyricsFontSize}px
                                </span>
                              </div>
                              <Slider
                                value={[settings.lyricsFontSize]}
                                min={12}
                                max={28}
                                step={1}
                                onValueChange={([v]) => updateSetting('lyricsFontSize', v)}
                              />
                            </div>
                          </>
                        )}
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">桌面歌词</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              在桌面显示悬浮歌词窗口
                            </p>
                          </div>
                          <Switch
                            checked={settings.desktopLyrics}
                            onCheckedChange={(v) => updateSetting('desktopLyrics', v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 动画 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-secondary" />
                        动效设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">界面动画</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              启用过渡动画和微交互效果
                            </p>
                          </div>
                          <Switch
                            checked={settings.animationEnabled}
                            onCheckedChange={(v) => updateSetting('animationEnabled', v)}
                          />
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">硬件加速</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              使用 GPU 加速渲染，提升动画流畅度
                            </p>
                          </div>
                          <Switch
                            checked={settings.hardwareAcceleration}
                            onCheckedChange={(v) => updateSetting('hardwareAcceleration', v)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'account' && (
                  <div className="space-y-6">
                    {/* 账号信息 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-secondary" />
                        账号信息
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">语言</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              选择应用显示语言
                            </p>
                          </div>
                          <Select
                            value={settings.language}
                            onValueChange={(v) =>
                              updateSetting('language', v as Settings['language'])
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zh-CN">简体中文</SelectItem>
                              <SelectItem value="en-US">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">消息通知</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              接收新歌推荐和活动通知
                            </p>
                          </div>
                          <Switch
                            checked={settings.notification}
                            onCheckedChange={(v) => updateSetting('notification', v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 下载设置 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Download className="w-4 h-4 text-secondary" />
                        下载设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">下载目录</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {settings.downloadPath}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/10"
                          >
                            更改
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground font-normal">同时下载数</Label>
                            <span className="text-sm text-secondary tabular-nums">
                              {settings.concurrentDownloads} 个
                            </span>
                          </div>
                          <Slider
                            value={[settings.concurrentDownloads]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={([v]) => updateSetting('concurrentDownloads', v)}
                          />
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">自动下载收藏</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              收藏的歌曲自动下载到本地
                            </p>
                          </div>
                          <Switch
                            checked={settings.autoDownload}
                            onCheckedChange={(v) => updateSetting('autoDownload', v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 启动设置 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-secondary" />
                        启动设置
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">开机自启动</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              系统启动时自动运行 Harmony Music
                            </p>
                          </div>
                          <Switch
                            checked={settings.autoStart}
                            onCheckedChange={(v) => updateSetting('autoStart', v)}
                          />
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground font-normal">最小化到托盘</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              关闭窗口时最小化到系统托盘
                            </p>
                          </div>
                          <Switch
                            checked={settings.minimizeToTray}
                            onCheckedChange={(v) => updateSetting('minimizeToTray', v)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'about' && (
                  <div className="space-y-6">
                    {/* 关于 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-secondary" />
                        关于 Harmony Music
                      </h3>
                      <div className="space-y-4 pl-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                            <Music className="w-7 h-7 text-white" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground">
                              Harmony Music
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              版本 2.0.0 · 沉浸式音乐体验
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/10"
                          >
                            检查更新
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 链接 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4 text-secondary" />
                        相关链接
                      </h3>
                      <div className="space-y-2 pl-6">
                        {[
                          '官方网站',
                          '使用帮助',
                          '隐私政策',
                          '服务条款',
                          '反馈建议',
                          '关于我们',
                        ].map((item) => (
                          <button
                            key={item}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          >
                            <span>{item}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* 版权 */}
                    <div className="text-center text-xs text-muted-foreground pt-2">
                      <p>© 2024 Harmony Music. All rights reserved.</p>
                      <p className="mt-1">Made with ♥ for music lovers</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
