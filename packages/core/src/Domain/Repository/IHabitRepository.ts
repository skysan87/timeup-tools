import { Habit } from "../Model/Habit"
import { UserId } from "../ValueObject"

export interface IHabitRepository {
  get(userId: UserId): Promise<Habit[] | null>
  save(userId: UserId, data: Partial<Habit>): Promise<void>
  update(userId: UserId, data: Partial<Habit>): Promise<void>
}