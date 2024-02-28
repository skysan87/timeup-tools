import { ITransactionScope } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"

export abstract class AbstractStorage implements ITransactionScope {

  constructor(private _userId: UserId) { }

  public get userId(): UserId {
    return this._userId
  }

  abstract get(key: string): any

  abstract save(key: string, data: any): void

  abstract delete(key: string): void
}