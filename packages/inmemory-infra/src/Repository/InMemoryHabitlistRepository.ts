import { Habitlist } from "@timeup-tools/core/model"
import { IHabitlistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"

export class InMemoryHabitlistRepository implements IHabitlistRepository {

  private memory: Map<UserId, Habitlist> = new Map<UserId, Habitlist>()

  get(userId: UserId): Promise<Habitlist | null> {
    const data = this.memory.get(userId) ?? null
    return Promise.resolve(structuredClone(data))
  }

  save(userId: UserId, data: Partial<Habitlist>): Promise<Habitlist> {
    const _data = {
      ...data,
      userId: userId
    } as Habitlist
    this.memory.set(userId, _data)
    return Promise.resolve(structuredClone(_data))
  }

  update(userId: UserId, data: Partial<Habitlist>): Promise<Habitlist> {
    const base = this.memory.get(userId) ?? {} as Habitlist
    const clone = {
      ...base,
      ...data
    } as Habitlist
    this.memory.set(userId, clone)
    return Promise.resolve(structuredClone(clone))
  }

}
