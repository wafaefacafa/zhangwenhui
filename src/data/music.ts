// EXPORTS: ISong, ILyricLine, IPlaylist, IArtist, IAlbum, MOCK_SONGS, MOCK_PLAYLISTS, MOCK_ARTISTS, MOCK_ALBUMS
export interface ILyricLine {
  time: number
  text: string
}

export interface ISong {
  id: string
  title: string
  artist: string
  artistId: string
  album: string
  albumId: string
  cover: string
  duration: number
  lyrics?: ILyricLine[]
}

export interface IPlaylist {
  id: string
  title: string
  cover: string
  creator: string
  creatorId: string
  playCount: number
  description: string
  songIds: string[]
}

export interface IArtist {
  id: string
  name: string
  avatar: string
  description: string
  followers: number
  albumIds: string[]
  hotSongIds: string[]
}

export interface IAlbum {
  id: string
  title: string
  cover: string
  artist: string
  artistId: string
  releaseDate: string
  description: string
  songIds: string[]
}

const MOCK_LYRICS: ILyricLine[] = [
  { time: 0, text: '星光洒满了整个夜晚' },
  { time: 5, text: '城市的霓虹在闪烁' },
  { time: 10, text: '我走在熟悉的街道' },
  { time: 15, text: '寻找着遗失的梦' },
  { time: 20, text: '风轻轻吹过耳边' },
  { time: 25, text: '带来了你的消息' },
  { time: 30, text: '那些美好的时光' },
  { time: 35, text: '如今都变成回忆' },
  { time: 40, text: '让音乐带走忧伤' },
  { time: 45, text: '让旋律点亮希望' },
  { time: 50, text: '在这无尽的夜里' },
  { time: 55, text: '我们一起歌唱' },
]

const COVER_NEON = 'https://picsum.photos/id/24/500/500'
const COVER_GUITAR = 'https://picsum.photos/id/10/500/500'
const COVER_HIPHOP = 'https://picsum.photos/id/29/500/500'

export const MOCK_SONGS: ISong[] = [
  {
    id: '1',
    title: '午夜星河',
    artist: '林夜',
    artistId: '1',
    album: '霓虹梦境',
    albumId: '1',
    cover: COVER_NEON,
    duration: 245,
    lyrics: MOCK_LYRICS,
  },
  {
    id: '2',
    title: '城市回响',
    artist: '苏晴',
    artistId: '2',
    album: '霓虹梦境',
    albumId: '1',
    cover: COVER_NEON,
    duration: 198,
    lyrics: MOCK_LYRICS,
  },
  {
    id: '3',
    title: '远方的风',
    artist: '陈默',
    artistId: '3',
    album: '木吉他的夏天',
    albumId: '2',
    cover: COVER_GUITAR,
    duration: 312,
    lyrics: MOCK_LYRICS,
  },
  {
    id: '4',
    title: '街头狂想',
    artist: 'GHOST',
    artistId: '4',
    album: '涂鸦之城',
    albumId: '3',
    cover: COVER_HIPHOP,
    duration: 276,
    lyrics: MOCK_LYRICS,
  },
  {
    id: '5',
    title: '月光奏鸣曲',
    artist: '林夜',
    artistId: '1',
    album: '霓虹梦境',
    albumId: '1',
    cover: COVER_NEON,
    duration: 223,
    lyrics: MOCK_LYRICS,
  },
  {
    id: '6',
    title: '雨后初晴',
    artist: '苏晴',
    artistId: '2',
    album: '木吉他的夏天',
    albumId: '2',
    cover: COVER_GUITAR,
    duration: 289,
    lyrics: MOCK_LYRICS,
  },
]

export const MOCK_PLAYLISTS: IPlaylist[] = [
  {
    id: '1',
    title: '深夜电子霓虹',
    cover: 'https://picsum.photos/id/24/500/500',
    creator: 'Harmony 推荐',
    creatorId: 'sys',
    playCount: 128560,
    description: '深夜独处必备的电子音乐精选，陪你度过每一个不眠之夜',
    songIds: ['1', '2', '5', '4'],
  },
  {
    id: '2',
    title: '治愈钢琴星空',
    cover: 'https://picsum.photos/id/42/500/500',
    creator: '音乐小站',
    creatorId: 'u2',
    playCount: 89420,
    description: '温柔的钢琴旋律，带你进入宁静的星空梦境',
    songIds: ['3', '6', '1'],
  },
  {
    id: '3',
    title: '摇滚现场舞台',
    cover: 'https://picsum.photos/id/29/500/500',
    creator: '摇滚电台',
    creatorId: 'u3',
    playCount: 67230,
    description: '最燃的摇滚现场，点燃你的热血青春',
    songIds: ['4', '2', '5'],
  },
  {
    id: '4',
    title: '爵士复古黑胶',
    cover: 'https://picsum.photos/id/48/500/500',
    creator: '复古唱片店',
    creatorId: 'u4',
    playCount: 45680,
    description: '经典爵士黑胶唱片精选，感受复古的魅力',
    songIds: ['3', '6', '2'],
  },
  {
    id: '5',
    title: '流行夏日海滨',
    cover: 'https://picsum.photos/id/15/500/500',
    creator: '夏日音乐季',
    creatorId: 'u5',
    playCount: 156780,
    description: '夏日海边必听流行金曲，清凉一夏',
    songIds: ['1', '4', '5', '6'],
  },
  {
    id: '6',
    title: '古典交响音乐厅',
    cover: 'https://picsum.photos/id/36/500/500',
    creator: '古典音乐厅',
    creatorId: 'u6',
    playCount: 34520,
    description: '经典交响乐精选，感受古典音乐的震撼',
    songIds: ['3', '1'],
  },
]

export const MOCK_ARTISTS: IArtist[] = [
  {
    id: '1',
    name: '林夜',
    avatar: 'https://picsum.photos/id/64/500/500',
    description: '独立电子音乐人，擅长合成器与氛围音乐创作，作品充满未来感与梦幻色彩。',
    followers: 285600,
    albumIds: ['1'],
    hotSongIds: ['1', '5', '2'],
  },
  {
    id: '2',
    name: '苏晴',
    avatar: 'https://picsum.photos/id/65/500/500',
    description: '治愈系女歌手，嗓音清澈温暖，作品多为都市情感主题。',
    followers: 512300,
    albumIds: ['1', '2'],
    hotSongIds: ['2', '6'],
  },
  {
    id: '3',
    name: '陈默',
    avatar: 'https://picsum.photos/id/66/500/500',
    description: '民谣唱作人，用一把木吉他讲述城市里的故事。',
    followers: 168900,
    albumIds: ['2'],
    hotSongIds: ['3', '6'],
  },
  {
    id: '4',
    name: 'GHOST',
    avatar: 'https://picsum.photos/id/67/500/500',
    description: '地下嘻哈制作人，街头文化爱好者，风格硬核前卫。',
    followers: 98700,
    albumIds: ['3'],
    hotSongIds: ['4'],
  },
]

export const MOCK_ALBUMS: IAlbum[] = [
  {
    id: '1',
    title: '霓虹梦境',
    cover: COVER_NEON,
    artist: '林夜',
    artistId: '1',
    releaseDate: '2024-03-15',
    description: '一张关于城市夜晚的电子概念专辑，用合成器编织出霓虹灯下的梦幻世界。',
    songIds: ['1', '2', '5'],
  },
  {
    id: '2',
    title: '木吉他的夏天',
    cover: COVER_GUITAR,
    artist: '陈默',
    artistId: '3',
    releaseDate: '2023-07-20',
    description: '记录夏日里那些简单而美好的瞬间，只有吉他和歌声。',
    songIds: ['3', '6'],
  },
  {
    id: '3',
    title: '涂鸦之城',
    cover: COVER_HIPHOP,
    artist: 'GHOST',
    artistId: '4',
    releaseDate: '2024-01-08',
    description: '来自街头的声音，用说唱描绘城市的每一面墙。',
    songIds: ['4'],
  },
]