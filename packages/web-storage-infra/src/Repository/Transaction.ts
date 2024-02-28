import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { SessionStorage } from "../Storage/SessionStorage"
import { InMemoryStorage } from "../Storage/InMemoryStorage"

export class SessionStorageTransaction implements ITransaction {
  async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new SessionStorage(userId))
  }
  async runBatch(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new SessionStorage(userId))
  }
}

export class InMemoryTransaction implements ITransaction {
  async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new InMemoryStorage(userId))
  }
  async runBatch(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new InMemoryStorage(userId))
  }
  public static reset() {
    // for unit-test
    InMemoryStorage.clear()
  }
}
