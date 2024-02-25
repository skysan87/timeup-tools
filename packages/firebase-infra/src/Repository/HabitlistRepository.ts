import { CollectionReference, DocumentData, collection, doc, getDocs, limit, query, where } from "firebase/firestore"
import { Habitlist } from "@timeup-tools/core/model"
import { IHabitlistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { firestore } from "../AppSetting"
import { toHabitlistEntity } from "../Converter"
import { FirestoreTransactoinScope as Scope } from "../Repository/Transaction"

export class HabitlistRepository implements IHabitlistRepository {

  private habitlistId?: string

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的にuserIdに変更する(userIdを利用)
    return collection(firestore, 'habits')
  }

  public getId(): string {
    if (!this.habitlistId) {
      throw new Error('Habitlist is not initialized.')
    }
    return this.habitlistId
  }

  public async get(scope: Scope): Promise<Habitlist | null> {
    const q = query(this.getRef(scope.userId)
      , where('userId', '==', scope.userId)
      , limit(1)
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty || querySnapshot.size === 0) {
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = this.convert(doc.id, doc.data())
    this.habitlistId = data.id
    return structuredClone(data)
  }

  public async save(scope: Scope, data: Habitlist): Promise<Habitlist> {
    const entity = toHabitlistEntity(data)

    const newDocRef = doc(this.getRef(scope.userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    this.habitlistId = newData.id
    return newData
  }

  public async update(scope: Scope, data: Partial<Habitlist>): Promise<Habitlist> {
    const docRef = doc(this.getRef(scope.userId), data.id!)
    const entity = toHabitlistEntity(data as Habitlist)

    await scope.update(docRef, entity)
    const newData = structuredClone(data)
    newData.updatedAt = new Date()

    return newData as Habitlist
  }

  private convert(id: string, data: DocumentData): Habitlist {
    const habitlist = { ...data, id } as Habitlist
    habitlist.createdAt = data.createdAt?.toDate() ?? ''
    habitlist.updatedAt = data.createdAt?.toDate() ?? ''
    return habitlist
  }
}