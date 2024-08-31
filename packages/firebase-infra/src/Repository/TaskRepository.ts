import { CollectionReference, DocumentData, DocumentSnapshot, Query, collection, doc, getCountFromServer, getDocs, query, where } from "firebase/firestore"
import { Task } from "@timeup-tools/core/model"
import { ITaskRepository } from "@timeup-tools/core/repository"
import { UserId, DateNumber, TaskType, TaskState } from "@timeup-tools/core/value-object"
import { firestore } from "../AppSetting"
import { toTaskEntity } from "../Converter"
import { FirestoreTransactoinScope as Scope } from "./Transaction"

export class TaskRepository implements ITaskRepository {

  private static readonly MAX_COUNT: number = 300

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的に構造を変更する(userIdを利用)
    return collection(firestore, 'todos')
  }

  public async validateMaxSize(scope: Scope, tasklistId?: string): Promise<boolean> {
    const q = query(this.getRef(scope.userId)
      , where('listId', '==', tasklistId!)
      , where('userId', '==', scope.userId)
    )

    // TIPS:
    //  1000件で1Read
    //  https://cloud.google.com/firestore/pricing?hl=ja#aggregation_queries
    const snapshot = await getCountFromServer(q)
    const count = snapshot.data().count
    return count < TaskRepository.MAX_COUNT
  }

  public async getHabits(scope: Scope, today: DateNumber): Promise<Task[]> {
    const tasks: Task[] = []

    const q = query(this.getRef(scope.userId)
      , where('type', '==', TaskType.HABIT)
      , where('userId', '==', scope.userId)
      , where('startdate', '==', today)
    )

    tasks.push(...await this.getRecords(q))

    return tasks
  }

  public async getTodaysTasks(scope: Scope, today: DateNumber): Promise<Task[]> {
    const tasks: Task[] = []

    const q = (state: TaskState) => {
      return query(this.getRef(scope.userId)
        , where('type', '==', TaskType.TODO)
        , where('userId', '==', scope.userId)
        , where('state', '==', state)
        , where('startdate', '<=', today)
      )
    }

    tasks.push(...await this.getRecords(q(TaskState.Todo)))
    tasks.push(...await this.getRecords(q(TaskState.InProgress)))

    return tasks
  }

  public async getInProgressTasks(scope: Scope, today: DateNumber): Promise<Task[]> {
    const tasks: Task[] = []

    const qTodo = query(this.getRef(scope.userId)
      , where('type', '==', TaskType.TODO)
      , where('userId', '==', scope.userId)
      , where('state', '==', TaskState.InProgress)
    )

    tasks.push(...await this.getRecords(qTodo))

    const qHabit = query(this.getRef(scope.userId)
      , where('type', '==', TaskType.HABIT)
      , where('userId', '==', scope.userId)
      , where('startdate', '==', today)
      , where('state', '==', TaskState.InProgress)
    )

    tasks.push(...await this.getRecords(qHabit))

    return tasks
  }

  public async getTodaysDone(scope: Scope, today: DateNumber): Promise<Task[]> {
    const tasks: Task[] = []

    const q = query(this.getRef(scope.userId)
      , where('type', '==', TaskType.TODO)
      , where('userId', '==', scope.userId)
      , where('state', '==', TaskState.Done)
      , where('stateChangeDate', '==', today)
    )

    tasks.push(...await this.getRecords(q))

    return tasks
  }

  public async get(scope: Scope, tasklistId: string): Promise<Task[]> {
    const tasks: Task[] = []

    const q = query(this.getRef(scope.userId)
      , where('listId', '==', tasklistId)
      , where('userId', '==', scope.userId)
    )

    tasks.push(...await this.getRecords(q))

    return tasks
  }

  public async getById(scope: Scope, taskId: string): Promise<Task | null> {
    const docRef = doc(this.getRef(scope.userId), taskId)
    const snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(snapshot.id, snapshot.data())
  }

  public async save(scope: Scope, data: Task): Promise<Task> {
    const entity = toTaskEntity(data)

    const newDocRef = doc(this.getRef(scope.userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    return newData
  }

  public async saveAll(scope: Scope, data: Task[]): Promise<Task[]> {
    const result: Task[] = []

    for (const task of data) {
      const entity = toTaskEntity(task)

      const newDocRef = doc(this.getRef(scope.userId))
      await scope.set(newDocRef, entity)

      const systemDate = new Date()
      const newData = structuredClone(task)
      newData.id = newDocRef.id
      newData.createdAt = systemDate
      newData.updatedAt = systemDate
      result.push(newData)
    }
    return result
  }

  public async update(scope: Scope, data: Partial<Task>): Promise<Task> {
    const docRef = doc(this.getRef(scope.userId), data.id!)
    const entity = toTaskEntity(data as Task)

    await scope.update(docRef, entity)

    const newData = structuredClone(data)
    newData.updatedAt = new Date()

    return newData as Task
  }

  public async updateAll(scope: Scope, data: Partial<Task>[]): Promise<Task[]> {
    const result: Task[] = []

    for (const task of data) {
      const entity = toTaskEntity(task as Task)

      const docRef = doc(this.getRef(scope.userId), task.id!)
      await scope.update(docRef, entity)

      const newData = structuredClone(task)
      newData.updatedAt = new Date()

      // FIXME: 更新した部分のみ返却している
      result.push(newData as Task)
    }

    return result
  }

  public async delete(scope: Scope, taskIds: string[]): Promise<void> {
    for (const taskId of taskIds) {
      const docRef = doc(this.getRef(scope.userId), taskId)
      await scope.delete(docRef)
    }
  }

  private convert(id: string, data: DocumentData): Task {
    const task = { ...data, id } as Task
    task.createdAt = data.createdAt?.toDate() ?? ''
    task.updatedAt = data.createdAt?.toDate() ?? ''
    // サブタスク実装前データ対応
    task.subTasks = structuredClone(task.subTasks ?? [])
    return task
  }

  private async getRecords(q: Query): Promise<Task[]> {
    return (await getDocs(q))
      .docs.map(doc => {
        return this.convert(doc.id, doc.data())
      })
  }
}