import { Entity } from "@/Entity"
import { firestore } from "../AppSetting"
import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"
import { DocumentReference, DocumentSnapshot, Transaction, WriteBatch, deleteDoc, getDoc, runTransaction, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'

class FirestoreTransactoinScope implements ITransactionScope {
  value: Transaction | WriteBatch | null = null

  public setTransaction(value: Transaction | WriteBatch) {
    this.value = value
  }

  public releaseTransaction() {
    this.value = null
  }

  public async get(docRef: DocumentReference<any>): Promise<DocumentSnapshot> {
    if (this.value instanceof Transaction) {
      return this.value.get(docRef)
    } else {
      return getDoc(docRef)
    }
  }

  public async set(docRef: DocumentReference<any>, data: Entity<any>) {
    data.createdAt = serverTimestamp()
    data.updatedAt = serverTimestamp()

    if (this.value instanceof Transaction) {
      this.value.set(docRef, data)
    } else if (this.value instanceof WriteBatch) {
      this.value.set(docRef, data)
    } else {
      await setDoc(docRef, data)
    }
  }

  public async update(docRef: DocumentReference<any>, data: Entity<any>) {
    data.updatedAt = serverTimestamp()

    // 更新する項目のみ
    const updateProps = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))

    if (this.value instanceof Transaction) {
      this.value.update(docRef, updateProps)
    } else if (this.value instanceof WriteBatch) {
      this.value.update(docRef, updateProps)
    } else {
      await updateDoc(docRef, updateProps)
    }
  }

  public async delete(docRef: DocumentReference<any>) {
    if (this.value instanceof Transaction) {
      this.value.delete(docRef)
    } else if (this.value instanceof WriteBatch) {
      this.value.delete(docRef)
    } else {
      await deleteDoc(docRef)
    }
  }
}

// singleton
export const scope = new FirestoreTransactoinScope()

export class FirestoreTransaction implements ITransaction {
  async run(callback: () => Promise<void>): Promise<void> {
    await runTransaction(firestore, async transaction => {
      try {
        scope.setTransaction(transaction)
        await callback()
      } catch (error) {
        // TODO: errorでrollbackするか確認
        throw error
      } finally {
        scope.releaseTransaction()
      }
    })
  }

  async runBatch(callback: () => Promise<void>): Promise<void> {
    try {
      const batch = writeBatch(firestore)
      scope.setTransaction(batch)
      await callback()
      await batch.commit()
    } catch (error) {
      throw error
    } finally {
      scope.releaseTransaction()
    }
  }
}