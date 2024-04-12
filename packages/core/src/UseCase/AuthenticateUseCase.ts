import { User } from "../Domain/Model"
import { IUserRepository } from "../Domain/Repository"

export class AuthenticateUseCase {

  constructor(
    private readonly repo: IUserRepository
  ) { }

  public async login(): Promise<User> {
    if (this.repo.authenticated()) {
      return await this.repo.get()
    }
    return await this.repo.login()
  }

  public async logout(): Promise<void> {
    await this.repo.logout()
  }

  public async getUser(): Promise<User> {
    return await this.repo.get()
  }

  public authenticated(): boolean {
    return this.repo.authenticated()
  }

  /**
   * 認証済み状態かチェックする
   * @description
   *  アプリケーション実行時に一度だけ実行する(app.vueで初期化)
   */
  public async initalize(): Promise<boolean> {
    await this.repo.initalize()
    return this.repo.authenticated()
  }
}