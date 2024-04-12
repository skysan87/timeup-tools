import { ITransactionScope } from "./ITransaction"
import { Habitlist } from "../Model/Habitlist"

/**
 * ユーザ毎に1つのレコード
 */
export interface IHabitlistRepository {
  getId(): string
  get(scope: ITransactionScope): Promise<Habitlist | null>
  save(scope: ITransactionScope, data: Habitlist): Promise<Habitlist>
  update(scope: ITransactionScope, data: Partial<Habitlist>): Promise<Habitlist>
}