import { Habit } from "@timeup-tools/core/model";
import { IHabitRepository } from "@timeup-tools/core/repository";
import { UserId, DateNumber } from "@timeup-tools/core/value-object";

export class InMemoryHabitRepository implements IHabitRepository {

  private memory: Array<Habit> = new Array<Habit>()

  public validateMaxSize(): boolean {
    return this.memory.length <= 50
  }

  public get(userId: UserId): Promise<Habit[]> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory))
    })
  }

  public getById(userId: UserId, habitId: string): Promise<Habit | null> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory.find(h => h.id === habitId) ?? null))
    })
  }

  public getTodayListFromCache(): Promise<Habit[]> {
    return new Promise(resolve => {
      resolve(this.memory.filter(h => h.isActive && h.isPlanDay))
    })
  }

  public save(userId: UserId, data: Habit): Promise<Habit> {
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

  public update(userId: UserId, data: Partial<Habit>): Promise<Habit> {
    let base = this.memory.find(h => h.id === data.id!)
    base = {
      ...base,
      ...data,
      updatedAt: new Date()
    } as Habit
    return Promise.resolve(structuredClone(base))
  }

  public delete(userId: UserId, habitId: string): Promise<void> {
    return new Promise(resolve => {
      const index = this.memory.findIndex(h => h.id === habitId)
      if (index > -1) {
        this.memory.splice(index, 1)
      }
      resolve()
    })
  }

}