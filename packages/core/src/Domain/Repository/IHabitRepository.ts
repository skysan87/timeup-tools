import { Habit } from "../Model/Habit"
import { DateNumber, UserId } from "../ValueObject"

export interface IHabitRepository {
  validateMaxSize(): boolean
  get(userId: UserId): Promise<Habit[]>
  getById(userId: UserId, habitId: string): Promise<Habit | null>
  getTodayListFromCache(): Promise<Habit[]>
  save(userId: UserId, data: Habit): Promise<Habit>
  update(userId: UserId, data: Partial<Habit>): Promise<Habit>
  delete(userId: UserId, habitId: string): Promise<void>
}