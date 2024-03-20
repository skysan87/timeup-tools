import { CollectionReference, DocumentData, DocumentSnapshot, collection, doc, getCountFromServer, getDocs, getDocsFromServer, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { Tasklist } from "@timeup-tools/core/model"
import { ITasklistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { firestore } from "../AppSetting"
import { toTasklistEntity } from "../Converter"
import { FirestoreTransactoinScope as Scope } from "./Transaction"

export class TasklistRepository implements ITasklistRepository {

  private static readonly MAX_COUNT: number = 20

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的に構造を変更する(userIdを利用)
    return collection(firestore, 'lists')
  }

  public async validateMaxSize(scope: Scope): Promise<boolean> {
    const q = query(this.getRef(scope.userId)
      , where('userId', '==', scope.userId)
      , where('deleteFlag', '==', false)
    )

    const snapshot = await getCountFromServer(q)
    const count = snapshot.data().count
    return count < TasklistRepository.MAX_COUNT
  }

  public async getMaxOrderIndex(scope: Scope): Promise<number> {
    const q = query(this.getRef(scope.userId)
      , where('userId', '==', scope.userId)
      , orderBy('orderIndex', 'desc')
      , limit(1)
    )
    const result = await getDocsFromServer(q)
    if (result.empty) {
      return 0
    } else {
      return result.docs[0].data().orderIndex ?? 0
    }
  }

  public async get(scope: Scope): Promise<Tasklist[]> {
    const q = query(this.getRef(scope.userId)
      , where('userId', '==', scope.userId)
      , orderBy('orderIndex')
    )

    const querySnapshot = await getDocs(q)
    const lists = querySnapshot.docs.map(doc => {
      return this.convert(doc.id, doc.data())
    })
    return lists
  }

  public async getById(scope: Scope, tasklistId: string): Promise<Tasklist | null> {
    const docRef = doc(this.getRef(scope.userId), tasklistId)
    const snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(snapshot.id, snapshot.data())
  }

  public async save(scope: Scope, data: Tasklist): Promise<Tasklist> {
    const entity = toTasklistEntity(data)

    const newDocRef = doc(this.getRef(scope.userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    return newData
  }

  public async update(scope: Scope, data: Partial<Tasklist>): Promise<Tasklist> {
    const entity = toTasklistEntity(data as Tasklist)

    const docRef = doc(this.getRef(scope.userId), data.id!)
    await scope.update(docRef, entity)

    const newData = structuredClone(data)
    newData.updatedAt = new Date()

    return newData as Tasklist
  }

  public async delete(scope: Scope, tasklistId: string): Promise<void> {
    const docRef = doc(this.getRef(scope.userId), tasklistId)
    await scope.delete(docRef)
  }

  private convert(id: string, data: DocumentData): Tasklist {
    const task = { ...data, id } as Tasklist
    task.createdAt = data.createdAt?.toDate() ?? ''
    task.updatedAt = data.createdAt?.toDate() ?? ''
    return task
  }
}