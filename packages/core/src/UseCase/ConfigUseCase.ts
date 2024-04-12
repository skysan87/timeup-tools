import { ConfigBehavior } from "../Domain/Behavior/ConfigBehavior"
import { Config } from "../Domain/Model"
import { IConfigRepository, ITransaction, IUserRepository } from "../Domain/Repository"
import { UserId } from "../Domain/ValueObject"

export class ConfigUseCase {
  constructor(
    private readonly userRepositpry: IUserRepository,
    private readonly configRepository: IConfigRepository,
    private readonly transaction: ITransaction
  ) { }

  private _userId: UserId | null = null

  private get userId(): UserId {
    return this._userId ?? this.userRepositpry.getFromCache().id
  }

  public create(): Config {
    return new ConfigBehavior({} as Config).format()
  }

  /**
   * 取得
   */
  public async getConfig(): Promise<Config> {
    let result: Config

    await this.transaction.run(this.userId, async (scope) => {
      const config = await this.configRepository.get(scope)

      if (config) {
        result = config
        return
      }

      const data = {
        userId: this.userId
      } as Config

      result = await new ConfigBehavior(data).actionAsync(async behavior => {
        const created = await this.configRepository.save(scope, behavior.format())
        behavior.update(created)
      })
    })

    return result!
  }

  /**
   * ヘッダーメッセージの更新
   * @param message
   * @returns
   */
  public async updateMessage(message: string): Promise<Config> {
    let result: Config
    await this.transaction.run(this.userId, async (scope) => {
      const data = {
        id: this.configRepository.getId(),
        globalMessage: message
      } as Config
      result = await new ConfigBehavior(data).actionAsync(async behavior => {
        const updated = await this.configRepository.update(scope, data)
        behavior.update(updated)
      })
    })
    return result!
  }
}