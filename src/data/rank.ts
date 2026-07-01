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
    cover: 'https://picsum.photos/id/24/500/500',
    hotLevel: 3,
    playCount: '98.2万'
  },
  {
    id: '2',
    rank: 2,
    title: '晴天',
    artist: '周杰伦',
    artistId: '2',
    cover: 'https://picsum.photos/id/10/500/500',
    hotLevel: 3,
    playCount: '95.6万'
  },
  {
    id: '3',
    rank: 3,
    title: '起风了',
    artist: '买辣椒也用券',
    artistId: '3',
    cover: 'https://picsum.photos/id/42/500/500',
    hotLevel: 2,
    playCount: '92.1万'
  },
  {
    id: '4',
    rank: 4,
    title: '稻香',
    artist: '周杰伦',
    artistId: '2',
    cover: 'https://picsum.photos/id/15/500/500',
    hotLevel: 2,
    playCount: '88.7万'
  },
  {
    id: '5',
    rank: 5,
    title: '光年之外',
    artist: '邓紫棋',
    artistId: '4',
    cover: 'https://picsum.photos/id/29/500/500',
    hotLevel: 2,
    playCount: '85.3万'
  },
  {
    id: '6',
    rank: 6,
    title: '海阔天空',
    artist: 'Beyond',
    artistId: '5',
    cover: 'https://picsum.photos/id/36/500/500',
    hotLevel: 2,
    playCount: '82.9万'
  },
  {
    id: '7',
    rank: 7,
    title: '平凡之路',
    artist: '朴树',
    artistId: '6',
    cover: 'https://picsum.photos/id/48/500/500',
    hotLevel: 1,
    playCount: '79.4万'
  },
  {
    id: '8',
    rank: 8,
    title: '成都',
    artist: '赵雷',
    artistId: '7',
    cover: 'https://picsum.photos/id/64/500/500',
    hotLevel: 1,
    playCount: '76.8万'
  },
  {
    id: '9',
    rank: 9,
    title: '消愁',
    artist: '毛不易',
    artistId: '8',
    cover: 'https://picsum.photos/id/65/500/500',
    hotLevel: 2,
    playCount: '73.5万'
  }
]