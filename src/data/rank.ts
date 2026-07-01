// EXPORTS: IRank, MOCK_RANKS
export interface IRank {
  id: string
  rank: number
  title: string
  artist: string
  artistId: string
  cover: string
  hotLevel: 1 | 2 | 3
  playCount: string
}

export const MOCK_RANKS: IRank[] = [
  {
    id: '1',
    rank: 1,
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    artistId: '1',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=stars%20night%20sky%20music%20cover%20dreamy%20purple%20blue&image_size=square',
    hotLevel: 3,
    playCount: '98.2万'
  },
  {
    id: '2',
    rank: 2,
    title: '晴天',
    artist: '周杰伦',
    artistId: '2',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sunny%20day%20blue%20sky%20music%20cover%20pop%20vibrant&image_size=square',
    hotLevel: 3,
    playCount: '95.6万'
  },
  {
    id: '3',
    rank: 3,
    title: '起风了',
    artist: '买辣椒也用券',
    artistId: '3',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wind%20blowing%20leaves%20music%20cover%20autumn%20peaceful&image_size=square',
    hotLevel: 2,
    playCount: '92.1万'
  },
  {
    id: '4',
    rank: 4,
    title: '稻香',
    artist: '周杰伦',
    artistId: '2',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=rice%20field%20golden%20harvest%20music%20cover%20countryside%20warm&image_size=square',
    hotLevel: 2,
    playCount: '88.7万'
  },
  {
    id: '5',
    rank: 5,
    title: '光年之外',
    artist: '邓紫棋',
    artistId: '4',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=outer%20space%20stars%20galaxy%20music%20cover%20science%20fiction&image_size=square',
    hotLevel: 2,
    playCount: '85.3万'
  },
  {
    id: '6',
    rank: 6,
    title: '海阔天空',
    artist: 'Beyond',
    artistId: '5',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=ocean%20sea%20sky%20horizon%20music%20cover%20inspirational%20blue&image_size=square',
    hotLevel: 2,
    playCount: '82.9万'
  },
  {
    id: '7',
    rank: 7,
    title: '平凡之路',
    artist: '朴树',
    artistId: '6',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=road%20journey%20landscape%20music%20cover%20peaceful%20simple&image_size=square',
    hotLevel: 1,
    playCount: '79.4万'
  },
  {
    id: '8',
    rank: 8,
    title: '成都',
    artist: '赵雷',
    artistId: '7',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=chengdu%20city%20night%20street%20music%20cover%20warm%20atmosphere&image_size=square',
    hotLevel: 1,
    playCount: '76.8万'
  },
  {
    id: '9',
    rank: 9,
    title: '消愁',
    artist: '毛不易',
    artistId: '8',
    cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=melancholy%20sad%20emotional%20music%20cover%20dark%20blue%20moody&image_size=square',
    hotLevel: 2,
    playCount: '73.5万'
  }
]