import { Task } from "../Model/Task"
import { DateNumber, UserId } from "../ValueObject"

export interface ITaskRepository {
  validateMaxSize(userId?: UserId, tasklistId?: string): Promise<boolean>
  getHabits(userId: UserId, today: DateNumber): Promise<Task[]>
  getTodaysTasks(userId: UserId, today: DateNumber): Promise<Task[]>
  getInProgressTasks(userId: UserId, today: DateNumber): Promise<Task[]>
  getTodaysDone(userId: UserId, today: DateNumber): Promise<Task[]>
  get(userId: UserId, tasklistId: string): Promise<Task[]>
  getById(userId: UserId, taskId: string): Promise<Task | null>
  save(userId: UserId, data: Task): Promise<Task>
  saveAll(userId: UserId, data: Task[]): Promise<Task[]>
  update(userId: UserId, data: Partial<Task>): Promise<Task>
  updateAll(userId: UserId, data: Partial<Task>[]): Promise<Task[]>
  delete(userId: UserId, taskIds: string[]): Promise<void>
}