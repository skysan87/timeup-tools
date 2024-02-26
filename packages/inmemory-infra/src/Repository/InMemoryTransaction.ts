import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"

export class InMemoryTransactionScope implements ITransactionScope {
  constructor(private _userId: UserId) { }

  public get userId(): UserId {
    return this._userId
  }
}

export class InMemoryTransaction implements ITransaction {
  async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new InMemoryTransactionScope(userId))
  }
  async runBatch(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new InMemoryTransactionScope(userId))
  }
}