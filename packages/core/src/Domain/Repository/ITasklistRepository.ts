import { Tasklist } from "../Model/Tasklist"
import { UserId } from "../ValueObject"

export interface ITasklistRepository {
  validateMaxSize(userId: UserId): Promise<boolean>
  getMaxIndex(userId: UserId): Promise<number>
  get(userId: UserId): Promise<Tasklist[]>
  getById(userId: UserId, tasklistId: string): Promise<Tasklist | null>
  save(userId: UserId, data: Tasklist): Promise<Tasklist>
  update(userId: UserId, data: Partial<Tasklist>): Promise<Tasklist>
  delete(userId: UserId, tasklistId: string): Promise<void>
}