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
    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylcylz_fsph_ryhs/ljhwZthlaukjlkulzlp/feisuda/avatar/base/1.jpg',
    level: 8,
    followingCount: 128,
    followerCount: 256,
  },
]