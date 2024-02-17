import { firestore } from "@/AppSetting"
import { toHabitlistEntity } from "@/Converter"
import { Habitlist } from "@timeup-tools/core/model"
import { IHabitlistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { CollectionReference, DocumentData, collection, doc, getDocs, limit, query, where } from "firebase/firestore"
import { scope } from "./Transaction"

export class HabitlistRepository implements IHabitlistRepository {

  private habitlist?: Habitlist

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的にuserIdに変更する(userIdを利用)
    return collection(firestore, 'habits')
  }

  public getId(): string {
    if (!this.habitlist) {
      throw new Error('Habitlist is not initialized.')
    }
    return this.habitlist.id
  }

  public async get(userId: UserId): Promise<Habitlist | null> {
    const q = query(this.getRef(userId!)
      , where('userId', '==', userId)
      , limit(1)
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty || querySnapshot.size === 0) {
      return null
    }

    const doc = querySnapshot.docs[0]
    this.habitlist = this.convert(doc.id, doc.data())
    return structuredClone(this.habitlist)
  }

  public async save(userId: UserId, data: Habitlist): Promise<Habitlist> {
    const entity = toHabitlistEntity(data)

    const newDocRef = doc(this.getRef(userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    return newData
  }

  public async update(userId: UserId, data: Partial<Habitlist>): Promise<Habitlist> {
    const docRef = doc(this.getRef(userId), data.id!)
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