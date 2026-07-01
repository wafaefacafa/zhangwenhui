import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'register' && password !== confirmPassword) {
        toast.error('两次输入的密码不一致');
        setIsLoading(false);
        return;
      }
      if (!email || !password) {
        toast.error('请填写完整信息');
        setIsLoading(false);
        return;
      }
      toast.success(mode === 'login' ? '登录成功，欢迎回来！' : '注册成功，欢迎加入！');
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* 背景渐变光晕 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[280px] h-[280px] rounded-full bg-secondary/10 blur-[90px]" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧品牌展示卡片 */}
          <div className="relative hidden md:flex flex-col justify-between p-8 rounded-2xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-xl">
            {/* 卡片背景渐变 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

            {/* 品牌 Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">
                    Harmony <span className="text-secondary">Music</span>
                  </div>
                  <div className="text-xs text-muted-foreground">沉浸式音乐体验</div>
                </div>
              </div>
            </div>

            {/* 耳机视觉 */}
            <div className="relative z-10 flex-1 flex items-center justify-center py-12">
              <div className="relative">
                {/* 光晕 */}
                <div className="absolute inset-0 -m-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl" />
                {/* 耳机图标（用 Headphones 图标 + 装饰模拟 3D 感） */}
                <div className="relative size-48 rounded-full bg-gradient-to-br from-primary/20 via-card/40 to-secondary/20 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15" />
                  <Headphones className="relative size-20 text-foreground/90 drop-shadow-[0_4px_20px_rgba(99_102_241_0.4)]" />
                </div>
                {/* 装饰光点 */}
                <div className="absolute -top-2 -right-2 size-3 rounded-full bg-secondary shadow-[0_0_20px_rgba(6_182_212_0.8)]" />
                <div className="absolute -bottom-1 -left-3 size-2 rounded-full bg-primary shadow-[0_0_15px_rgba(99_102_241_0.8)]" />
              </div>
            </div>

            {/* 底部标语 */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                发现你的
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {' '}音乐世界
                </span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                海量曲库、智能推荐、沉浸式体验，让每一次聆听都成为享受。
              </p>
            </div>
          </div>

          {/* 右侧登录/注册表单卡片 */}
          <div className="relative p-8 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden">
            {/* 卡片装饰渐变 */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* 移动端品牌 */}
              <div className="md:hidden flex items-center justify-center gap-2 mb-8">
                <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  Harmony <span className="text-secondary">Music</span>
                </div>
              </div>

              {/* 标题 */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {mode === 'login' ? '欢迎回来' : '创建账号'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {mode === 'login' ? '登录你的 Harmony Music 账号' : '加入我们，开启音乐之旅'}
                </p>
              </div>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">用户名</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        className="pl-10 h-11 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">邮箱 / 账号</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入邮箱或账号"
                      className="pl-10 h-11 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      className="pl-10 pr-10 h-11 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">确认密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="请再次输入密码"
                        className="pl-10 pr-10 h-11 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                      <input type="checkbox" className="rounded border-white/20 bg-background/50 text-primary focus:ring-primary/30" />
                      记住我
                    </label>
                    <button
                      type="button"
                      className="text-secondary hover:text-secondary/80 transition-colors"
                      onClick={() => toast.info('请联系客服重置密码')}
                    >
                      忘记密码？
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full h-11 font-medium text-white rounded-lg',
                    'bg-gradient-to-r from-primary to-secondary',
                    'hover:opacity-90 hover:shadow-lg hover:shadow-primary/25',
                    'transition-all duration-300',
                    'disabled:opacity-60 disabled:cursor-not-allowed'
                  )}
                >
                  {isLoading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'}
                </Button>
              </form>

              {/* 切换模式 */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === 'login' ? '还没有账号？' : '已有账号？'}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  {mode === 'login' ? '立即注册' : '立即登录'}
                </button>
              </div>

              {/* 分隔线 */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-muted-foreground">其他方式</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* 第三方登录 */}
              <div className="grid grid-cols-3 gap-3">
                {['微信', 'QQ', '手机号'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toast.info(`${item}登录即将开放`)}
                    className="h-10 rounded-lg border border-white/10 bg-background/30 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-background/50 transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* 游客入口 */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  以游客身份浏览 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
