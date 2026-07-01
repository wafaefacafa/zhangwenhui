import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { scopedStorage } from '@lark-apaas/client-toolkit-lite';
import { type ISong, MOCK_SONGS } from '@/data/music';
import { type IUser, MOCK_USERS } from '@/data/user';

export type PlayMode = 'sequence' | 'loop' | 'random';

interface PlayerContextValue {
  currentSong: ISong | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  queue: ISong[];
  favorites: string[];
  recentPlay: ISong[];
  user: IUser | null;
  playSong: (song: ISong, queue?: ISong[]) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  togglePlayMode: () => void;
  nextSong: () => void;
  prevSong: () => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  clearQueue: () => void;
  removeFromQueue: (songId: string) => void;
  playPlaylist: (songs: ISong[]) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const STORAGE_KEYS = {
  CURRENT_SONG: '__harmony_current_song',
  IS_PLAYING: '__harmony_is_playing',
  PROGRESS: '__harmony_progress',
  VOLUME: '__harmony_volume',
  PLAY_MODE: '__harmony_play_mode',
  QUEUE: '__harmony_queue',
  FAVORITES: '__harmony_favorites',
  RECENT_PLAY: '__harmony_recent_play',
};

const DEFAULT_SONG = MOCK_SONGS[0];
const DEFAULT_QUEUE = MOCK_SONGS;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<ISong | null>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.CURRENT_SONG);
      return raw ? (JSON.parse(raw) as ISong) : DEFAULT_SONG;
    } catch {
      return DEFAULT_SONG;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.IS_PLAYING);
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });

  const [progress, setProgressState] = useState<number>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.PROGRESS);
      return raw ? Number(raw) : 0;
    } catch {
      return 0;
    }
  });

  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.VOLUME);
      return raw ? Number(raw) : 70;
    } catch {
      return 70;
    }
  });

  const [playMode, setPlayMode] = useState<PlayMode>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.PLAY_MODE);
      return (raw as PlayMode) || 'sequence';
    } catch {
      return 'sequence';
    }
  });

  const [queue, setQueue] = useState<ISong[]>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.QUEUE);
      return raw ? (JSON.parse(raw) as ISong[]) : DEFAULT_QUEUE;
    } catch {
      return DEFAULT_QUEUE;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [recentPlay, setRecentPlay] = useState<ISong[]>(() => {
    try {
      const raw = scopedStorage.getItem(STORAGE_KEYS.RECENT_PLAY);
      return raw ? (JSON.parse(raw) as ISong[]) : [];
    } catch {
      return [];
    }
  });

  const progressIntervalRef = useRef<number | null>(null);

  // 播放进度模拟
  useEffect(() => {
    if (isPlaying && currentSong) {
      progressIntervalRef.current = window.setInterval(() => {
        setProgressState((prev) => {
          const next = prev + 1;
          if (next >= currentSong.duration) {
            // 播放结束，切下一首
            handleNextInternal();
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentSong?.id]);

  // 持久化
  useEffect(() => {
    if (currentSong) {
      scopedStorage.setItem(STORAGE_KEYS.CURRENT_SONG, JSON.stringify(currentSong));
    }
  }, [currentSong]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.IS_PLAYING, JSON.stringify(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.PROGRESS, String(progress));
  }, [progress]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.VOLUME, String(volume));
  }, [volume]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.PLAY_MODE, playMode);
  }, [playMode]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    scopedStorage.setItem(STORAGE_KEYS.RECENT_PLAY, JSON.stringify(recentPlay));
  }, [recentPlay]);

  const addToRecent = useCallback((song: ISong) => {
    setRecentPlay((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [song, ...filtered].slice(0, 20);
    });
  }, []);

  const playSong = useCallback(
    (song: ISong, newQueue?: ISong[]) => {
      setCurrentSong(song);
      setProgressState(0);
      setIsPlaying(true);
      addToRecent(song);
      if (newQueue && newQueue.length > 0) {
        setQueue(newQueue);
      }
    },
    [addToRecent]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setProgress = useCallback((value: number) => {
    setProgressState(Math.max(0, value));
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.max(0, Math.min(100, value)));
  }, []);

  const togglePlayMode = useCallback(() => {
    setPlayMode((prev) => {
      if (prev === 'sequence') return 'loop';
      if (prev === 'loop') return 'random';
      return 'sequence';
    });
  }, []);

  const handleNextInternal = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    let nextIndex: number;
    if (playMode === 'random') {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (playMode === 'loop') {
      nextIndex = currentIndex;
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    const nextSong = queue[nextIndex];
    if (nextSong) {
      setCurrentSong(nextSong);
      setProgressState(0);
      addToRecent(nextSong);
    }
  }, [currentSong, queue, playMode, addToRecent]);

  const nextSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    let nextIndex: number;
    if (playMode === 'random') {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    const next = queue[nextIndex];
    if (next) {
      setCurrentSong(next);
      setProgressState(0);
      setIsPlaying(true);
      addToRecent(next);
    }
  }, [currentSong, queue, playMode, addToRecent]);

  const prevSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    const prev = queue[prevIndex];
    if (prev) {
      setCurrentSong(prev);
      setProgressState(0);
      setIsPlaying(true);
      addToRecent(prev);
    }
  }, [currentSong, queue, addToRecent]);

  const toggleFavorite = useCallback((songId: string) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  }, []);

  const isFavorite = useCallback(
    (songId: string) => favorites.includes(songId),
    [favorites]
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentSong(null);
    setIsPlaying(false);
    setProgressState(0);
  }, []);

  const removeFromQueue = useCallback(
    (songId: string) => {
      setQueue((prev) => prev.filter((s) => s.id !== songId));
      if (currentSong?.id === songId) {
        setCurrentSong(null);
        setIsPlaying(false);
        setProgressState(0);
      }
    },
    [currentSong]
  );

  const playPlaylist = useCallback(
    (songs: ISong[]) => {
      if (songs.length === 0) return;
      setQueue(songs);
      setCurrentSong(songs[0]);
      setProgressState(0);
      setIsPlaying(true);
      if (songs[0]) addToRecent(songs[0]);
    },
    [addToRecent]
  );

  const duration = currentSong?.duration ?? 0;
  const user = MOCK_USERS[0] ?? null;

  const value: PlayerContextValue = {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    playMode,
    queue,
    favorites,
    recentPlay,
    user,
    playSong,
    togglePlay,
    setProgress,
    setVolume,
    togglePlayMode,
    nextSong,
    prevSong,
    toggleFavorite,
    isFavorite,
    clearQueue,
    removeFromQueue,
    playPlaylist,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
