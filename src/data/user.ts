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
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=music%20lover%20avatar%20portrait%20casual%20style%20warm%20friendly%20smile&image_size=square',
    level: 8,
    followingCount: 128,
    followerCount: 256,
  },
]