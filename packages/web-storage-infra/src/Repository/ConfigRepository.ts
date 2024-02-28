import { Config } from "@timeup-tools/core/model"
import { IConfigRepository } from "@timeup-tools/core/repository"
import { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class ConfigRepository implements IConfigRepository {

  private static readonly KEY: string = 'CONFIG'

  private _id?: string

  public getId(): string {
    if (!this._id) {
      throw new Error('Config is not initialized.')
    }
    return this._id
  }

  public get(scope: Scope): Promise<Config | null> {
    const data = scope.get(ConfigRepository.KEY)
    if (data) {
      this._id = data.id
    }
    return Promise.resolve(structuredClone(data))
  }

  public save(scope: Scope, data: Config): Promise<Config> {
    const timestamp = new Date()
    const _data = {
      ...data,
      userId: scope.userId,
      id: 'dummyConfig',
      createdAt: timestamp,
      updatedAt: timestamp
    } as Config
    scope.save(ConfigRepository.KEY, _data)
    this._id = _data.id
    return Promise.resolve(structuredClone(_data))
  }

  public update(scope: Scope, data: Partial<Config>): Promise<Config> {
    const base = scope.get(ConfigRepository.KEY) ?? {} as Config
    const clone = {
      ...base,
      ...data,
      updatedAt: new Date()
    } as Config
    scope.save(ConfigRepository.KEY, clone)
    return Promise.resolve(structuredClone(clone))
  }
}