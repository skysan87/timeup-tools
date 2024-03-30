import { Nominal, UserId } from "../ValueObject";

export type Tasklist = Nominal<{
  id: string
  title: string | null
  detail: string | undefined
  userId: UserId
  /** TaskのorderIndexの最大値 */
  maxIndex: number
  /** Tasklistの表示順 */
  orderIndex: number
  createdAt: Date | null
  updatedAt: Date | null
}, 'Tasklist'>