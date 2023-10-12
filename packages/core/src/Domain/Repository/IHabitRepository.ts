import { Habit } from "../Model/Habit"
import { DateNumber, UserId } from "../ValueObject"

export interface IHabitRepository {
  validateMaxSize(): boolean
  get(userId: UserId, habitlistId: string): Promise<Habit[]>
  getById(userId: UserId, habitlistId: string, habitId: string): Promise<Habit | null>
  getTodayListFromCache(): Promise<Habit[]>
  save(userId: UserId, habitlistId: string, data: Habit): Promise<Habit>
  update(userId: UserId, habitlistId: string, data: Partial<Habit>): Promise<Habit>
  delete(userId: UserId, habitlistId: string, habitId: string): Promise<void>
}