import { Task } from "@timeup-tools/core/model"
import { ITaskRepository } from "@timeup-tools/core/repository"
import { DateNumber, TaskType, TaskState } from "@timeup-tools/core/value-object"
import { WebStorageTransactionScope as Scope } from "./Transaction"

export class TaskRepository implements ITaskRepository {

  private static readonly KEY: string = 'TASK'

  public validateMaxSize(scope: Scope): Promise<boolean> {
    const data: Task[] = scope.get(TaskRepository.KEY)
    return Promise.resolve(data.length <= 100)
  }

  public getHabits(scope: Scope, today: DateNumber): Promise<Task[]> {
    return new Promise(resolve => {
      const data: Task[] = scope.get(TaskRepository.KEY)
      resolve(
        data.filter(t => t.type === TaskType.HABIT && t.startdate === today)
      )
    })
  }

  public getTodaysTasks(scope: Scope, today: DateNumber): Promise<Task[]> {
    return new Promise(resolve => {
      const states: TaskState[] = [TaskState.Todo, TaskState.InProgress]
      const memory: Task[] = scope.get(TaskRepository.KEY)
      resolve(
        memory.filter(t =>
          t.type === TaskType.TODO
          && states.includes(t.state)
          && t.startdate !== null
          && t.startdate <= today
        )
      )
    })
  }

  public getInProgressTasks(scope: Scope, today: DateNumber): Promise<Task[]> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)
      resolve(
        memory.filter(t =>
          t.type === TaskType.TODO
          && t.state === TaskState.InProgress
        )
      )
    })
  }

  public getTodaysDone(scope: Scope, today: DateNumber): Promise<Task[]> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)
      resolve(
        memory.filter(t =>
          t.type === TaskType.TODO
          && t.state === TaskState.Done
          && t.stateChangeDate === today
        )
      )
    })
  }

  public get(scope: Scope, tasklistId: string): Promise<Task[]> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)
      resolve(
        memory.filter(t =>
          t.type === TaskType.TODO
          && t.listId === tasklistId
        )
      )
    })
  }

  public getById(scope: Scope, taskId: string): Promise<Task | null> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)
      resolve(memory.find(h => h.id === taskId) ?? null)
    })
  }

  public save(scope: Scope, data: Task): Promise<Task> {
    return new Promise(resolve => {
      const timestamp = new Date()
      data.id = this.createId()
      data.userId = scope.userId
      data.createdAt = timestamp
      data.updatedAt = timestamp

      const memory: Task[] = scope.get(TaskRepository.KEY)
      memory.push(data)
      scope.save(TaskRepository.KEY, memory)

      resolve(data)
    })
  }

  public saveAll(scope: Scope, data: Task[]): Promise<Task[]> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)

      const updated: Task[] = []
      for (const task of data) {
        const timestamp = new Date()
        task.id = this.createId()
        task.userId = scope.userId
        task.createdAt = timestamp
        task.updatedAt = timestamp
        updated.push(task)
        memory.push(task)
      }
      scope.save(TaskRepository.KEY, memory)

      resolve(updated)
    })
  }

  public update(scope: Scope, data: Partial<Task>): Promise<Task> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)

      const index = memory.findIndex(h => h.id === data.id!)
      const clone = {
        ...memory[index],
        ...data,
        updatedAt: new Date()
      } as Task
      memory[index] = clone
      scope.save(TaskRepository.KEY, memory)

      resolve(structuredClone(clone))
    })
  }

  public updateAll(scope: Scope, data: Partial<Task>[]): Promise<Task[]> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)

      const updated: Task[] = []
      for (const task of data) {
        const index = memory.findIndex(h => h.id === task.id!)
        const clone = {
          ...memory[index],
          ...task,
          updatedAt: new Date()
        } as Task
        memory[index] = clone
        updated.push(clone)
      }
      scope.save(TaskRepository.KEY, memory)

      resolve(structuredClone(updated))
    })
  }

  public delete(scope: Scope, taskIds: string[]): Promise<void> {
    return new Promise(resolve => {
      const memory: Task[] = scope.get(TaskRepository.KEY)

      for (const id of taskIds) {
        const index = memory.findIndex(h => h.id === id)
        if (index > -1) {
          memory.splice(index, 1)
        }
      }
      scope.save(TaskRepository.KEY, memory)

      resolve()
    })
  }

  private createId(): string {
    // 重複する場合があるので、乱数を追加(あくまで重複の可能性を下げるだけ)
    return Date.now().toString() + Math.floor(Math.random() * 100).toString(16)
  }
}