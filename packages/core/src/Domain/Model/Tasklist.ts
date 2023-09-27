import { Nominal, UserId } from "../ValueObject";

export type Tasklist = Nominal<{
  id: string
  title: string
  detail: string
  userId: UserId
  maxIndex: number
  orderIndex: number
  createdAt: Date | null
  updatedAt: Date | null
}, 'Tasklist'>