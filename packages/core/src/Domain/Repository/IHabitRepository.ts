import { ITransactionScope } from "./ITransaction"
import { Habit } from "../Model/Habit"
import { UserId } from "../ValueObject"

export interface IHabitRepository {
  validateMaxSize(scope: ITransactionScope, habitlistId?: string): Promise<boolean>
  get(scope: ITransactionScope, habitlistId: string): Promise<Habit[]>
  getFromCache(userId: UserId, habitlistId: string): Promise<Habit[]>
  getById(scope: ITransactionScope, habitlistId: string, habitId: string): Promise<Habit | null>
  save(scope: ITransactionScope, habitlistId: string, data: Habit): Promise<Habit>
  update(scope: ITransactionScope, habitlistId: string, data: Partial<Habit>): Promise<Habit>
  delete(scope: ITransactionScope, habitlistId: string, habitId: string): Promise<void>
}