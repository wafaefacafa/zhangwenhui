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
    cover: 'https://picsum.photos/id/24/500/500',
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
    cover: 'https://picsum.photos/id/10/500/500',
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
    cover: 'https://picsum.photos/id/36/500/500',
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
    cover: 'https://picsum.photos/id/29/500/500',
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
    cover: 'https://picsum.photos/id/42/500/500',
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
    cover: 'https://picsum.photos/id/48/500/500',
    status: 'completed',
    progress: 100,
    speed: '—',
    size: '6.9MB',
  },
]