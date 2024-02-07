import { Nominal, UserId } from "../ValueObject";

export type Habitlist = Nominal<{
  id: string // TODO: userId
  userId: UserId
  maxIndex: number
  createdAt: Date | null
  updatedAt: Date | null
}, 'Habitlist'>