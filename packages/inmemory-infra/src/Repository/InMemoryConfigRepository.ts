import { Config } from "@timeup-tools/core/model"
import { IConfigRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"

export class InMemoryConfigRepository implements IConfigRepository {

  private memory: Map<UserId, Config> = new Map<UserId, Config>()

  public get(userId: UserId): Promise<Config | null> {
    const data = this.memory.get(userId) ?? null
    return Promise.resolve(structuredClone(data))
  }

  public save(userId: UserId, data: Config): Promise<Config> {
    const _data = {
      ...data,
      userId: userId
    } as Config
    this.memory.set(userId, _data)
    return Promise.resolve(structuredClone(_data))
  }

  public update(userId: UserId, data: Partial<Config>): Promise<Config> {
    const base = this.memory.get(userId) ?? {} as Config
    const clone = {
      ...base,
      ...data
    } as Config
    this.memory.set(userId, clone)
    return Promise.resolve(structuredClone(clone))
  }
}