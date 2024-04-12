import { Config } from "../Model/Config"
import { BehaviorBase } from "./BehaviorBase"

export class ConfigBehavior extends BehaviorBase<Config> {

  public format(): Config {
    const v = this.value
    return {
      id: v.id,
      userId: v.userId,
      globalMessage: v.globalMessage ?? '',
      createdAt: v.createdAt ?? null,
      updatedAt: v.updatedAt ?? null
    } as Config
  }
}