// EXPORTS: IUser, MOCK_USERS
export interface IUser {
  id: string
  username: string
  avatar: string
  level: number
  followingCount: number
  followerCount: number
}

export const MOCK_USERS: IUser[] = [
  {
    id: '1',
    username: 'Harmony乐迷',
    avatar: 'https://picsum.photos/id/64/500/500',
    level: 8,
    followingCount: 128,
    followerCount: 256,
  },
]