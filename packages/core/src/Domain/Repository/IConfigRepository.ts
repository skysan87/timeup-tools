import { Config } from "../Model/Config"
import { UserId } from "../ValueObject"

export interface IConfigRepository {
  get(userId: UserId): Promise<Config | null>
  save(userId: UserId, data: Partial<Config>): Promise<void>
  update(userId: UserId, data: Partial<Config>): Promise<void>
}