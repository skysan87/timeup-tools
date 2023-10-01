import { User } from "../Domain/Model"
import { IUserRepository } from "../Domain/Repository"

export class AuthenticateUseCase {

  constructor(
    private readonly repo: IUserRepository
  ) { }

  public async login(): Promise<User> {
    if (await this.repo.authenticated()) {
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

  /**
   * 認証済み状態かチェックする
   * @description
   *  アプリケーション実行時に一度だけ実行する。(app.vueなどで初期化)
   */
  public async checkLogin(): Promise<boolean> {
    return await this.repo.authenticated()
  }
}