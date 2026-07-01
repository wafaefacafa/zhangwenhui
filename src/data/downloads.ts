// EXPORTS: IDownloadTask, MOCK_DOWNLOADS
export interface IDownloadTask {
  id: string
  songId: string
  title: string
  artist: string
  cover: string
  status: 'downloading' | 'paused' | 'completed' | 'error'
  progress: number
  speed: string
  size: string
}

export const MOCK_DOWNLOADS: IDownloadTask[] = [
  {
    id: '1',
    songId: 's1',
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=stars%20night%20sky%20music%20cover%20dreamy%20purple%20blue&image_size=square',
    status: 'downloading',
    progress: 68,
    speed: '2.4MB/s',
    size: '8.5MB',
  },
  {
    id: '2',
    songId: 's2',
    title: '晴天',
    artist: '周杰伦',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sunny%20day%20blue%20sky%20music%20cover%20pop%20vibrant&image_size=square',
    status: 'paused',
    progress: 35,
    speed: '0KB/s',
    size: '10.2MB',
  },
  {
    id: '3',
    songId: 's3',
    title: '海阔天空',
    artist: 'Beyond',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=ocean%20sea%20sky%20horizon%20music%20cover%20inspirational%20blue&image_size=square',
    status: 'completed',
    progress: 100,
    speed: '—',
    size: '7.8MB',
  },
  {
    id: '4',
    songId: 's4',
    title: '光年之外',
    artist: '邓紫棋',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=outer%20space%20stars%20galaxy%20music%20cover%20science%20fiction&image_size=square',
    status: 'downloading',
    progress: 82,
    speed: '1.8MB/s',
    size: '9.1MB',
  },
  {
    id: '5',
    songId: 's5',
    title: '起风了',
    artist: '买辣椒也用券',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wind%20blowing%20leaves%20music%20cover%20autumn%20peaceful&image_size=square',
    status: 'error',
    progress: 45,
    speed: '0KB/s',
    size: '11.3MB',
  },
  {
    id: '6',
    songId: 's6',
    title: '平凡之路',
    artist: '朴树',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=road%20journey%20landscape%20music%20cover%20peaceful%20simple&image_size=square',
    status: 'completed',
    progress: 100,
    speed: '—',
    size: '6.9MB',
  },
]