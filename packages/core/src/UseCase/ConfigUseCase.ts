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

  /**
   * 取得
   */
  public async getConfig(): Promise<Config> {
    let result: Config

    await this.transaction.run(async () => {
      const config = await this.configRepository.get(this.userId)

      if (config) {
        result = config
        return
      }

      const data = {
        userId: this.userId
      } as Config

      result = await new ConfigBehavior(data).actionAsync(async behavior => {
        const created = await this.configRepository.save(this.userId, behavior.format())
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
    await this.transaction.run(async () => {
      const data = { globalMessage: message } as Config
      result = await new ConfigBehavior(data).actionAsync(async behavior => {
        const updated = await this.configRepository.update(this.userId, data)
        behavior.update(updated)
      })
    })
    return result!
  }
}