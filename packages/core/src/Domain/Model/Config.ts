import { UserId, Nominal } from "../ValueObject"

export type Config = Nominal<{
  id: string // ランダム TODO: userIdを利用するように変更
  userId: UserId
  globalMessage: string
  createdAt: Date | null
  updatedAt: Date | null
}, 'Config'>