import { ITransactionScope } from "./ITransaction"
import { Config } from "../Model/Config"

/**
 * ユーザ毎に1つのレコード
 */
export interface IConfigRepository {
  getId(): string
  get(scope: ITransactionScope): Promise<Config | null>
  save(scope: ITransactionScope, data: Config): Promise<Config>
  update(scope: ITransactionScope, data: Partial<Config>): Promise<Config>
}