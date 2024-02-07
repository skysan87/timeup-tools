import { Tasklist } from "@timeup-tools/core/model"
import { ITasklistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"

export class InMemoryTasklistRepository implements ITasklistRepository {

  private memory: Array<Tasklist> = new Array<Tasklist>()

  public validateMaxSize(): boolean {
    return this.memory.length <= 10
  }

  public getMaxIndex(): number {
    return this.memory.map(i => i.maxIndex).reduce((a, b) => Math.max(a, b), 0)
  }

  public get(userId: UserId): Promise<Tasklist[]> {
    return Promise.resolve(structuredClone(this.memory))
  }

  public getById(userId: UserId, tasklistId: string): Promise<Tasklist | null> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory.find(t => t.id === tasklistId) ?? null))
    })
  }

  public save(userId: UserId, data: Tasklist): Promise<Tasklist> {
    return new Promise(resolve => {
      const timestamp = new Date()
      data.id = Date.now().toString()
      data.userId = userId
      data.createdAt = timestamp
      data.updatedAt = timestamp
      this.memory.push(data)
      resolve(data)
    })
  }

  public update(userId: UserId, data: Partial<Tasklist>): Promise<Tasklist> {
    const index = this.memory.findIndex(h => h.id === data.id!)
    const clone = {
      ...this.memory[index],
      ...data,
      updatedAt: new Date()
    } as Tasklist
    return Promise.resolve(structuredClone(clone))
  }

  public delete(userId: UserId, tasklistId: string): Promise<void> {
    return new Promise(resolve => {
      const index = this.memory.findIndex(t => t.id === tasklistId)
      if (index > -1) {
        this.memory.splice(index, 1)
      }
      resolve()
    })
  }

}