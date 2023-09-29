import { Tasklist } from "../Model/Tasklist"
import { UserId } from "../ValueObject"

export interface ITasklistRepository {
  get(userId: UserId): Promise<Tasklist | null>
  save(userId: UserId, data: Partial<Tasklist>): Promise<void>
  update(userId: UserId, data: Partial<Tasklist>): Promise<void>
}