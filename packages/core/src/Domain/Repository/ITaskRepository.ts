import { Task } from "../Model/Task"
import { UserId } from "../ValueObject"

export interface ITaskRepository {
  get(userId: UserId): Promise<Task | null>
  save(userId: UserId, data: Partial<Task>): Promise<void>
  update(userId: UserId, data: Partial<Task>): Promise<void>
}