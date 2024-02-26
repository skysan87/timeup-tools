import { ITransactionScope } from "./ITransaction"
import { Tasklist } from "../Model/Tasklist"

export interface ITasklistRepository {
  validateMaxSize(scope: ITransactionScope): Promise<boolean>
  getMaxIndex(scope: ITransactionScope): Promise<number>
  get(scope: ITransactionScope): Promise<Tasklist[]>
  getById(scope: ITransactionScope, tasklistId: string): Promise<Tasklist | null>
  save(scope: ITransactionScope, data: Tasklist): Promise<Tasklist>
  update(scope: ITransactionScope, data: Partial<Tasklist>): Promise<Tasklist>
  delete(scope: ITransactionScope, tasklistId: string): Promise<void>
}