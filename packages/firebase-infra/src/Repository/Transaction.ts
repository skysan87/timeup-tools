import { firestore } from "../AppSetting"
import { ITransaction, ITransactionScope } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { DocumentReference, DocumentSnapshot, Transaction, WriteBatch, deleteDoc, getDoc, runTransaction, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'

export class FirestoreTransactoinScope implements ITransactionScope {
  private _value: Transaction | WriteBatch | null = null
  private _userId: UserId

  constructor(userId: UserId) {
    this._userId = userId
  }

  public get userId() {
    return this._userId
  }

  public setTransaction(value: Transaction | WriteBatch) {
    if (this._value !== null) {
      throw new Error('TransactionScope is locked.')
    }
    this._value = value
  }

  public releaseTransaction() {
    this._value = null
  }

  public async get(docRef: DocumentReference<any>): Promise<DocumentSnapshot> {
    if (this._value instanceof Transaction) {
      return this._value.get(docRef)
    } else {
      return getDoc(docRef)
    }
  }

  public async set(docRef: DocumentReference<any>, data: any) {
    data.createdAt = serverTimestamp()
    data.updatedAt = serverTimestamp()

    if (this._value instanceof Transaction) {
      this._value.set(docRef, data)
    } else if (this._value instanceof WriteBatch) {
      this._value.set(docRef, data)
    } else {
      await setDoc(docRef, data)
    }
  }

  public async update(docRef: DocumentReference<any>, data: any) {
    data.updatedAt = serverTimestamp()

    // 更新する項目のみ
    const updateProps: any = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))

    if (this._value instanceof Transaction) {
      this._value.update(docRef, updateProps)
    } else if (this._value instanceof WriteBatch) {
      this._value.update(docRef, updateProps)
    } else {
      await updateDoc(docRef, updateProps)
    }
  }

  public async delete(docRef: DocumentReference<any>) {
    if (this._value instanceof Transaction) {
      this._value.delete(docRef)
    } else if (this._value instanceof WriteBatch) {
      this._value.delete(docRef)
    } else {
      await deleteDoc(docRef)
    }
  }
}

export class FirestoreTransaction implements ITransaction {
  async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await runTransaction(firestore, async transaction => {
      const scope = new FirestoreTransactoinScope(userId)
      try {
        scope.setTransaction(transaction)
        await callback(scope)
      } catch (error) {
        // TODO: errorでrollbackするか確認
        throw error
      } finally {
        scope.releaseTransaction()
      }
    })
  }

  async runBatch(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    const scope = new FirestoreTransactoinScope(userId)
    try {
      const batch = writeBatch(firestore)
      scope.setTransaction(batch)
      await callback(scope)
      await batch.commit()
    } catch (error) {
      throw error
    } finally {
      scope.releaseTransaction()
    }
  }
}