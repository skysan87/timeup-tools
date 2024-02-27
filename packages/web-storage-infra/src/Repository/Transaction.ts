import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"

export class WebStorageTransactionScope implements ITransactionScope {
  constructor(private _userId: UserId) { }

  public get userId(): UserId {
    return this._userId
  }

  public get(key: string): any {
    const jsonStr = sessionStorage.getItem(key)
    return !jsonStr ? null : JSON.parse(jsonStr)
  }

  public save(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data))
  }

  public delete(key: string): void {
    sessionStorage.removeItem(key)
  }
}

export class WebStorageTransaction implements ITransaction {
  async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new WebStorageTransactionScope(userId))
  }
  async runBatch(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new WebStorageTransactionScope(userId))
  }
}