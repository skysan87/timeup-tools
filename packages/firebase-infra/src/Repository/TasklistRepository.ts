import { Tasklist } from "@timeup-tools/core/model"
import { ITasklistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { scope } from "./Transaction"
import { firestore } from "../AppSetting"
import { CollectionReference, DocumentData, DocumentSnapshot, collection, doc, getCountFromServer, getDocs, getDocsFromServer, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { getCount } from "firebase/firestore/lite"
import { toTasklistEntity } from "@/Converter"

export class TasklistRepository implements ITasklistRepository {

  private static readonly MAX_COUNT: number = 20

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的に構造を変更する(userIdを利用)
    return collection(firestore, 'lists')
  }

  public async validateMaxSize(userId: UserId): Promise<boolean> {
    const q = query(this.getRef(userId!)
      , where('userId', '==', userId!)
      , where('deleteFlag', '==', false)
    )

    let count: number
    try {
      const snapshot = await getCountFromServer(q)
      count = snapshot.data().count
    } catch (err) {
      console.warn('Server Access Failed.', err)
      const snapshot = await getCount(q)
      count = snapshot.data().count
    }
    return count < TasklistRepository.MAX_COUNT
  }

  public async getMaxIndex(userId: UserId): Promise<number> {
    // TODO: firestoreの構造を変更時にmaxIndexを保持するようにする
    const q = query(this.getRef(userId!)
      , where('userId', '==', userId!)
      , where('deleteFlag', '==', false)
      , orderBy('maxIndex', 'desc')
      , limit(1)
    )
    const result = await getDocsFromServer(q)
    if (result.empty) {
      return 0
    } else {
      return result.docs[0].data().maxIndex ?? 0
    }
  }

  public async get(userId: UserId): Promise<Tasklist[]> {
    const q = query(this.getRef(userId!)
      , where('userId', '==', userId!)
      , where('deleteFlag', '==', false)
    )

    const querySnapshot = await getDocs(q)
    const lists = querySnapshot.docs.map(doc => {
      return this.convert(doc.id, doc.data())
    })
    return lists
  }

  public async getById(userId: UserId, tasklistId: string): Promise<Tasklist | null> {
    const docRef = doc(this.getRef(userId), tasklistId)
    const snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(snapshot.id, snapshot.data())
  }

  public async save(userId: UserId, data: Tasklist): Promise<Tasklist> {
    const entity = toTasklistEntity(data)

    const newDocRef = doc(this.getRef(userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    return newData
  }

  public async update(userId: UserId, data: Partial<Tasklist>): Promise<Tasklist> {
    const entity = toTasklistEntity(data as Tasklist)

    const docRef = doc(this.getRef(userId), data.id!)
    await scope.update(docRef, entity)

    const newData = structuredClone(data)
    newData.updatedAt = new Date()

    return newData as Tasklist
  }

  public async delete(userId: UserId, tasklistId: string): Promise<void> {
    const docRef = doc(this.getRef(userId), tasklistId)
    await scope.delete(docRef)
  }

  private convert(id: string, data: DocumentData): Tasklist {
    const task = { ...data, id } as Tasklist
    task.createdAt = data.createdAt?.toDate() ?? ''
    task.updatedAt = data.createdAt?.toDate() ?? ''
    return task
  }
}