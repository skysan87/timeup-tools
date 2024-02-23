import { CollectionReference, DocumentData, DocumentSnapshot, collection, doc, getCountFromServer, getDocs, getDocsFromCache, query, where } from "firebase/firestore"
import { Habit } from "@timeup-tools/core/model"
import { IHabitRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { scope } from "./Transaction"
import { firestore } from "../AppSetting"
import { toHabitEntity } from "../Converter"

export class HabitRepository implements IHabitRepository {

  private static readonly MAX_COUNT: number = 20

  private getRef(userId: UserId, tasklistId: string): CollectionReference {
    // TODO: 将来的にuserIdに変更する(userIdを利用)
    return collection(firestore, 'habits', tasklistId, 'habits')
  }

  public async validateMaxSize(userId?: UserId, tasklistId?: string): Promise<boolean> {
    const q = query(this.getRef(userId!, tasklistId!))

    // TIPS:
    //  1000件で1Read
    //  https://cloud.google.com/firestore/pricing?hl=ja#aggregation_queries
    const snapshot = await getCountFromServer(q)
    const count = snapshot.data().count
    return count < HabitRepository.MAX_COUNT
  }

  public async getFromCache(userId: UserId, habitlistId: string): Promise<Habit[]> {
    const q = query(this.getRef(userId, habitlistId)
      , where('userId', '==', userId)
    )

    const snapshot = await getDocsFromCache(q)
    return snapshot.docs.map(doc => this.convert(doc.id, doc.data()))
  }

  public async get(userId: UserId, habitlistId: string): Promise<Habit[]> {
    const q = query(this.getRef(userId, habitlistId)
      , where('userId', '==', userId)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => this.convert(doc.id, doc.data()))
  }

  public async getById(userId: UserId, habitlistId: string, habitId: string): Promise<Habit | null> {
    const docRef = doc(this.getRef(userId, habitlistId), habitId)
    const snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(snapshot.id, snapshot.data())
  }

  public async getTodayListFromCache(userId: UserId, habitlistId: string): Promise<Habit[]> {
    const q = query(this.getRef(userId, habitlistId)
      , where('userId', '==', userId)
    )

    const snapshot = await getDocsFromCache(q)

    console.log('get Data from cache: ', snapshot.metadata.fromCache)

    return snapshot.docs.map(doc => this.convert(doc.id, doc.data()))
      .filter(h => h.isActive && h.isPlanDay)
  }

  public async save(userId: UserId, habitlistId: string, data: Habit): Promise<Habit> {
    const entity = toHabitEntity(data)

    const newDocRef = doc(this.getRef(userId, habitlistId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    return newData
  }

  public async update(userId: UserId, habitlistId: string, data: Partial<Habit>): Promise<Habit> {
    const docRef = doc(this.getRef(userId, habitlistId), data.id!)
    const entity = toHabitEntity(data as Habit)

    await scope.update(docRef, entity)

    const newData = structuredClone(data)
    newData.updatedAt = new Date()

    return newData as Habit
  }

  public async delete(userId: UserId, habitlistId: string, habitId: string): Promise<void> {
    const docRef = doc(this.getRef(userId, habitlistId), habitId)
    await scope.delete(docRef)
  }

  private convert(id: string, data: DocumentData): Habit {
    const habit = { ...data, id } as Habit
    habit.createdAt = data.createdAt?.toDate() ?? ''
    habit.updatedAt = data.createdAt?.toDate() ?? ''
    return habit
  }
}