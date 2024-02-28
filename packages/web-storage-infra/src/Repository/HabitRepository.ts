import { Habit } from "@timeup-tools/core/model"
import { IHabitRepository } from "@timeup-tools/core/repository"
import { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class HabitRepository implements IHabitRepository {

  private static readonly KEY: string = 'HABIT'

  private getData(scope: Scope): Habit[] {
    return scope.get(HabitRepository.KEY) ?? []
  }

  public async validateMaxSize(scope: Scope): Promise<boolean> {
    const data: Habit[] = this.getData(scope)
    return Promise.resolve(data.length <= 50)
  }

  public get(scope: Scope, habitlistId: string): Promise<Habit[]> {
    return Promise.resolve(this.getData(scope))
  }

  public getFromCache(scope: Scope, habitlistId: string): Promise<Habit[]> {
    return this.get(scope, habitlistId)
  }

  public getById(scope: Scope, habitlistId: string, habitId: string): Promise<Habit | null> {
    return new Promise(resolve => {
      const data: Habit[] = this.getData(scope)
      resolve(structuredClone(data.find(h => h.id === habitId) ?? null))
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

      const memory: Habit[] = this.getData(scope)
      memory.push(data)
      scope.save(HabitRepository.KEY, memory)

      resolve(structuredClone(data))
    })
  }

  public update(scope: Scope, habitlistId: string, data: Partial<Habit>): Promise<Habit> {
    return new Promise(resolve => {
      const memory: Habit[] = this.getData(scope)

      const index = memory.findIndex(h => h.id === data.id!)
      const clone = {
        ...memory[index],
        ...data,
        updatedAt: new Date()
      } as Habit
      memory[index] = clone
      scope.save(HabitRepository.KEY, memory)

      resolve(structuredClone(clone))
    })
  }

  public delete(scope: Scope, habitlistId: string, habitId: string): Promise<void> {
    return new Promise(resolve => {
      const memory: Habit[] = this.getData(scope)

      const index = memory.findIndex(h => h.id === habitId)
      if (index > -1) {
        memory.splice(index, 1)
      }
      scope.save(HabitRepository.KEY, memory)

      resolve()
    })
  }

}