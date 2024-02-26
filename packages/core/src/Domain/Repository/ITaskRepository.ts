import { Task } from "../Model/Task"
import { DateNumber } from "../ValueObject"
import { ITransactionScope } from "./ITransaction"

export interface ITaskRepository {
  validateMaxSize(scope: ITransactionScope, tasklistId?: string): Promise<boolean>
  getHabits(scope: ITransactionScope, today: DateNumber): Promise<Task[]>
  getTodaysTasks(scope: ITransactionScope, today: DateNumber): Promise<Task[]>
  getInProgressTasks(scope: ITransactionScope, today: DateNumber): Promise<Task[]>
  getTodaysDone(scope: ITransactionScope, today: DateNumber): Promise<Task[]>
  get(scope: ITransactionScope, tasklistId: string): Promise<Task[]>
  getById(scope: ITransactionScope, taskId: string): Promise<Task | null>
  save(scope: ITransactionScope, data: Task): Promise<Task>
  saveAll(scope: ITransactionScope, data: Task[]): Promise<Task[]>
  update(scope: ITransactionScope, data: Partial<Task>): Promise<Task>
  updateAll(scope: ITransactionScope, data: Partial<Task>[]): Promise<Task[]>
  delete(scope: ITransactionScope, taskIds: string[]): Promise<void>
}