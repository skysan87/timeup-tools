import { Config } from "@timeup-tools/core/model"
import { IConfigRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { InMemoryTransactionScope as Scope } from "./InMemoryTransaction"

export class InMemoryConfigRepository implements IConfigRepository {

  private memory: Map<UserId, Config> = new Map<UserId, Config>()

  private _id?: string

  public getId(): string {
    if (!this._id) {
      throw new Error('Config is not initialized.')
    }
    return this._id
  }

  public get(scope: Scope): Promise<Config | null> {
    const data = this.memory.get(scope.userId) ?? null
    if (data) {
      this._id = data.id
    }
    return Promise.resolve(structuredClone(data))
  }

  public save(scope: Scope, data: Config): Promise<Config> {
    const _data = {
      ...data,
      userId: scope.userId
    } as Config
    this.memory.set(scope.userId, _data)
    this._id = _data.id
    return Promise.resolve(structuredClone(_data))
  }

  public update(scope: Scope, data: Partial<Config>): Promise<Config> {
    const base = this.memory.get(scope.userId) ?? {} as Config
    const clone = {
      ...base,
      ...data
    } as Config
    this.memory.set(scope.userId, clone)
    return Promise.resolve(structuredClone(clone))
  }
}