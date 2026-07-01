import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2 } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // 声波频谱条数量和高度
  const bars = useMemo(
    () => Array.from({ length: 48 }, (_, i) => i),
    []
  );

  // 加载进度动画
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => {
            navigate('/login');
          }, 600);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [navigate]);

  const displayProgress = Math.min(100, Math.floor(progress));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-screen bg-background overflow-hidden flex flex-col items-center justify-center"
      >
        {/* 背景渐变光晕 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        {/* 左侧流线装饰 */}
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-30 pointer-events-none"
          viewBox="0 0 200 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0,${50 + i * 28} Q60,${20 + i * 28} 100,${50 + i * 28} T200,${40 + i * 28}`}
              fill="none"
              stroke="url(#purpleGrad)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 2 + i * 0.15,
                delay: i * 0.08,
                ease: 'easeOut',
              }}
            />
          ))}
        </svg>

        {/* 右侧流线装饰 */}
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-30 pointer-events-none scale-x-[-1]"
          viewBox="0 0 200 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(189 94% 43%)" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(189 94% 43%)" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0,${60 + i * 26} Q50,${30 + i * 26} 90,${55 + i * 26} T200,${50 + i * 26}`}
              fill="none"
              stroke="url(#cyanGrad)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 2.2 + i * 0.12,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </svg>

        {/* 主内容 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
              <Music2 className="w-12 h-12 text-white" strokeWidth={1.5} />
              {/* 光晕 */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl -z-10" />
            </div>
          </motion.div>

          {/* 品牌名 */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl font-bold text-foreground mb-2 tracking-wide"
          >
            Harmony <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Music</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-muted-foreground text-sm mb-12"
          >
            沉浸式音乐体验
          </motion.p>

          {/* 声波频谱动画 */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-end justify-center gap-[3px] h-20 mb-12 w-80"
          >
            {bars.map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-primary via-secondary to-secondary/60"
                initial={{ height: 4 }}
                animate={{
                  height: [
                    4 + Math.random() * 10,
                    30 + Math.random() * 40,
                    10 + Math.random() * 20,
                    50 + Math.random() * 25,
                    20 + Math.random() * 30,
                    4 + Math.random() * 10,
                  ],
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: i * 0.03,
                }}
                style={{
                  opacity: 0.5 + Math.random() * 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* 加载进度条 */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '280px' }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-72 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
              正在加载... {displayProgress}%
            </p>
          </motion.div>
        </motion.div>

        {/* 底部版本信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 text-xs text-muted-foreground"
        >
          Harmony Music v1.0.0
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
