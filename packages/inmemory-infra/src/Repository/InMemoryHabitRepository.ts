import { Habit } from "@timeup-tools/core/model"
import { IHabitRepository } from "@timeup-tools/core/repository"
import { InMemoryTransactionScope as Scope } from "./InMemoryTransaction"
import { UserId } from "@timeup-tools/core/value-object"

export class InMemoryHabitRepository implements IHabitRepository {

  private memory: Array<Habit> = new Array<Habit>()

  public async validateMaxSize(scope: Scope): Promise<boolean> {
    return Promise.resolve(this.memory.length <= 50)
  }

  public get(scope: Scope, habitlistId: string): Promise<Habit[]> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory))
    })
  }

  public getFromCache(userId: UserId, habitlistId: string): Promise<Habit[]> {
    return this.get(new Scope(userId), habitlistId)
  }

  public getById(scope: Scope, habitlistId: string, habitId: string): Promise<Habit | null> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory.find(h => h.id === habitId) ?? null))
    })
  }

  public save(scope: Scope, habitlistId: string, data: Habit): Promise<Habit> {
    return new Promise(resolve => {
      const timestamp = new Date()
      data.id = Date.now().toString()
      data.rootId = habitlistId
      data.userId = scope.userId
      data.createdAt = timestamp
      data.updatedAt = timestamp
      this.memory.push(data)
      resolve(data)
    })
  }

  public update(scope: Scope, habitlistId: string, data: Partial<Habit>): Promise<Habit> {
    const index = this.memory.findIndex(h => h.id === data.id!)
    const clone = {
      ...this.memory[index],
      ...data,
      updatedAt: new Date()
    } as Habit
    this.memory[index] = clone
    return Promise.resolve(structuredClone(clone))
  }

  public delete(scope: Scope, habitlistId: string, habitId: string): Promise<void> {
    return new Promise(resolve => {
      const index = this.memory.findIndex(h => h.id === habitId)
      if (index > -1) {
        this.memory.splice(index, 1)
      }
      resolve()
    })
  }

}