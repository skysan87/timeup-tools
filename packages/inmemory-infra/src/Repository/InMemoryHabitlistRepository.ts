import { Habitlist } from "@timeup-tools/core/model"
import { IHabitlistRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { InMemoryTransactionScope as Scope } from "./InMemoryTransaction"

export class InMemoryHabitlistRepository implements IHabitlistRepository {

  private memory: Map<UserId, Habitlist> = new Map<UserId, Habitlist>()

  private _id?: string

  public getId(): string {
    if (!this._id) {
      throw new Error('Habitlist is not initialized.')
    }
    return this._id
  }

  get(scope: Scope): Promise<Habitlist | null> {
    const data = this.memory.get(scope.userId) ?? null
    if (data) {
      this._id = data.id
    }
    return Promise.resolve(structuredClone(data))
  }

  save(scope: Scope, data: Habitlist): Promise<Habitlist> {
    const _data = {
      ...data,
      userId: scope.userId,
      id: 'dummyHabitlistId'
    } as Habitlist
    this.memory.set(scope.userId, _data)
    this._id = _data.id
    return Promise.resolve(structuredClone(_data))
  }

  update(scope: Scope, data: Partial<Habitlist>): Promise<Habitlist> {
    const base = this.memory.get(scope.userId) ?? {} as Habitlist
    const clone = {
      ...base,
      ...data
    } as Habitlist
    this.memory.set(scope.userId, clone)
    return Promise.resolve(structuredClone(clone))
  }

}
