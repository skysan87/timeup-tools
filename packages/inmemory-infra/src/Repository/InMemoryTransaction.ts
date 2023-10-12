import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"

class InMemoryTransactionScope implements ITransactionScope {
  value: Object = {}
}

export class InMemoryTransaction implements ITransaction {
  async run(callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new InMemoryTransactionScope())
  }
}