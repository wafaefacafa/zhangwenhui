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
    cover: '/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkiokulmkbw_ve_miaoda',
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
    cover: '/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkiojqdmchs_ve_miaoda',
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
    cover: '/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkioizyj4gs_ve_miaoda',
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
    cover: '/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkiofej5qiu_ve_miaoda',
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
    cover: '/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkioj4ebmbw_ve_miaoda',
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
    cover: '/spark/app/app_1796yh5rvym/runtime/api/v1/storage/object/bucket_aadkioro44ucs_static/static%2Faadkiojcy6ggu_ve_miaoda',
    status: 'completed',
    progress: 100,
    speed: '—',
    size: '6.9MB',
  },
]