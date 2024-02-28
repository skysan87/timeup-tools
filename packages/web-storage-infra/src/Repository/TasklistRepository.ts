import { Tasklist } from "@timeup-tools/core/model"
import { ITasklistRepository } from "@timeup-tools/core/repository"
import { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class TasklistRepository implements ITasklistRepository {

  private static readonly KEY: string = 'TASKLIST'

  private getData(scope: Scope): Tasklist[] {
    return scope.get(TasklistRepository.KEY) ?? []
  }

  public validateMaxSize(scope: Scope): Promise<boolean> {
    const data: Tasklist[] = this.getData(scope)
    return Promise.resolve(data.length <= 10)
  }

  public getMaxIndex(scope: Scope): Promise<number> {
    return new Promise((resolve) => {
      const data: Tasklist[] = this.getData(scope)
      resolve(data
        .map(i => i.maxIndex)
        .reduce((a, b) => Math.max(a, b), 0)
      )
    })
  }

  public get(scope: Scope): Promise<Tasklist[]> {
    return Promise.resolve(this.getData(scope))
  }

  public getById(scope: Scope, tasklistId: string): Promise<Tasklist | null> {
    return new Promise(resolve => {
      const memory: Tasklist[] = this.getData(scope)
      resolve(structuredClone(memory.find(t => t.id === tasklistId) ?? null))
    })
  }

  public save(scope: Scope, data: Tasklist): Promise<Tasklist> {
    return new Promise(resolve => {
      const timestamp = new Date()
      data.id = Date.now().toString()
      data.userId = scope.userId
      data.createdAt = timestamp
      data.updatedAt = timestamp

      const memory: Tasklist[] = this.getData(scope)
      memory.push(data)
      scope.save(TasklistRepository.KEY, memory)

      resolve(structuredClone(data))
    })
  }

  public update(scope: Scope, data: Partial<Tasklist>): Promise<Tasklist> {
    const memory: Tasklist[] = this.getData(scope)

    const index = memory.findIndex(h => h.id === data.id!)
    const clone = {
      ...memory[index],
      ...data,
      updatedAt: new Date()
    } as Tasklist
    memory[index] = clone
    scope.save(TasklistRepository.KEY, memory)

    return Promise.resolve(structuredClone(clone))
  }

  public delete(scope: Scope, tasklistId: string): Promise<void> {
    return new Promise(resolve => {
      const memory: Tasklist[] = this.getData(scope)

      const index = memory.findIndex(t => t.id === tasklistId)
      if (index > -1) {
        memory.splice(index, 1)
      }
      scope.save(TasklistRepository.KEY, memory)

      resolve()
    })
  }

}