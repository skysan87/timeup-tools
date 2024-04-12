import { Habitlist } from "@timeup-tools/core/model"
import { IHabitlistRepository } from "@timeup-tools/core/repository"
import { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class HabitlistRepository implements IHabitlistRepository {

  private static readonly KEY: string = 'HABITLIST'

  private _id?: string

  public getId(): string {
    if (!this._id) {
      throw new Error('Habitlist is not initialized.')
    }
    return this._id
  }

  get(scope: Scope): Promise<Habitlist | null> {
    const data = scope.get(HabitlistRepository.KEY)
    if (data) {
      this._id = data.id
    }
    return Promise.resolve(structuredClone(data))
  }

  save(scope: Scope, data: Habitlist): Promise<Habitlist> {
    const timestamp = new Date()
    const _data = {
      ...data,
      userId: scope.userId,
      id: 'dummyHabitlistId',
      createdAt: timestamp,
      updatedAt: timestamp
    } as Habitlist
    scope.save(HabitlistRepository.KEY, _data)
    this._id = _data.id
    return Promise.resolve(structuredClone(_data))
  }

  update(scope: Scope, data: Partial<Habitlist>): Promise<Habitlist> {
    const base = scope.get(HabitlistRepository.KEY) ?? {} as Habitlist
    const clone = {
      ...base,
      ...data,
      updatedAt: new Date()
    } as Habitlist
    scope.save(HabitlistRepository.KEY, clone)
    return Promise.resolve(structuredClone(clone))
  }

}
