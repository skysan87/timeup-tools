import { firestore } from "../AppSetting"
import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"
import { Transaction } from 'firebase/firestore'
import { runTransaction } from 'firebase/firestore'

class FirestoreTransactoinScope implements ITransactionScope {
  value: Transaction | null = null

  public setTransaction(value: Transaction) {
    this.value = value
  }

  public releaseTransaction() {
    this.value = null
  }

  public get hasTransaction() : boolean {
    return this.value !== null
  }
}

// singleton
export const scope = new FirestoreTransactoinScope()

export class Firestoreransaction implements ITransaction {
  async run(callback: () => Promise<void>): Promise<void> {
    await runTransaction(firestore, async transaction => {
      try {
        scope.setTransaction(transaction)
        await callback()
      } catch(error) {
        // TODO: errorでrollbackするか確認
        throw error
      } finally {
        scope.releaseTransaction()
      }
    })
  }
}