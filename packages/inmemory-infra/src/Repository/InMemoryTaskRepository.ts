import { Task } from "@timeup-tools/core/model"
import { ITaskRepository } from "@timeup-tools/core/repository"
import { DateNumber, TaskType, TaskState } from "@timeup-tools/core/value-object"
import { InMemoryTransactionScope as Scope } from "./InMemoryTransaction"

export class InMemoryTaskRepository implements ITaskRepository {

  private memory: Array<Task> = new Array<Task>()

  public validateMaxSize(): Promise<boolean> {
    return Promise.resolve(this.memory.length <= 100)
  }

  public getHabits(scope: Scope, today: DateNumber): Promise<Task[]> {
    return Promise.resolve(this.memory.filter(t => t.type === TaskType.HABIT && t.startdate === today))
  }

  public getTodaysTasks(scope: Scope, today: DateNumber): Promise<Task[]> {
    const states: TaskState[] = [TaskState.Todo, TaskState.InProgress]
    return Promise.resolve(
      this.memory.filter(t =>
        t.type === TaskType.TODO
        && states.includes(t.state)
        && t.startdate !== null
        && t.startdate <= today
      )
    )
  }

  public getInProgressTasks(scope: Scope, today: DateNumber): Promise<Task[]> {
    return Promise.resolve(
      this.memory.filter(t =>
        t.type === TaskType.TODO
        && t.state === TaskState.InProgress
      )
    )
  }

  public getTodaysDone(scope: Scope, today: DateNumber): Promise<Task[]> {
    return Promise.resolve(
      this.memory.filter(t =>
        t.type === TaskType.TODO
        && t.state === TaskState.Done
        && t.stateChangeDate === today
      )
    )
  }

  public get(scope: Scope, tasklistId: string): Promise<Task[]> {
    return Promise.resolve(
      this.memory.filter(t =>
        t.type === TaskType.TODO
        && t.listId === tasklistId
      )
    )
  }

  public getById(scope: Scope, taskId: string): Promise<Task | null> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory.find(h => h.id === taskId) ?? null))
    })
  }

  public save(scope: Scope, data: Task): Promise<Task> {
    return new Promise(resolve => {
      const timestamp = new Date()
      data.id = this.createId()
      data.userId = scope.userId
      data.createdAt = timestamp
      data.updatedAt = timestamp
      this.memory.push(data)
      resolve(data)
    })
  }

  public saveAll(scope: Scope, data: Task[]): Promise<Task[]> {
    return new Promise(resolve => {
      const updated: Task[] = []
      for (const task of data) {
        const timestamp = new Date()
        task.id = this.createId()
        task.userId = scope.userId
        task.createdAt = timestamp
        task.updatedAt = timestamp
        this.memory.push(task)
        updated.push(task)
      }
      resolve(updated)
    })
  }

  public update(scope: Scope, data: Partial<Task>): Promise<Task> {
    const index = this.memory.findIndex(h => h.id === data.id!)
    const clone = {
      ...this.memory[index],
      ...data,
      updatedAt: new Date()
    } as Task
    this.memory[index] = clone
    return Promise.resolve(structuredClone(clone))
  }

  public updateAll(scope: Scope, data: Partial<Task>[]): Promise<Task[]> {
    return new Promise(resolve => {
      const updated: Task[] = []
      for (const task of data) {
        const index = this.memory.findIndex(h => h.id === task.id!)
        const clone = {
          ...this.memory[index],
          ...task,
          updatedAt: new Date()
        } as Task
        this.memory[index] = clone
        updated.push(clone)
      }
      resolve(updated)
    })
  }

  public delete(scope: Scope, taskIds: string[]): Promise<void> {
    return new Promise(resolve => {
      for (const id of taskIds) {
        const index = this.memory.findIndex(h => h.id === id)
        if (index > -1) {
          this.memory.splice(index, 1)
        }
      }
      resolve()
    })
  }

  private createId(): string {
    // 重複する場合があるので、乱数を追加(あくまで重複の可能性を下げるだけ)
    return Date.now().toString() + Math.floor(Math.random() * 100).toString(16)
  }
}