import { User } from "@timeup-tools/core/model"
import { IUserRepository } from "@timeup-tools/core/repository"
import { DisplayName, Mail, UserId } from "@timeup-tools/core/value-object"

export class DummyUserRepository implements IUserRepository {

  private user: User | null = null

  private _skipAuth: boolean = false

  private isInitalized: boolean = false

  constructor(skipAuth = false) {
    this._skipAuth = skipAuth
  }

  public async initalize(): Promise<void> {
    if (this._skipAuth) {
      await this.login() // 起動時のみ自動ログイン
    }
    this.isInitalized = true
  }

  public get(): Promise<User> {
    if (!this.authenticated()) {
      return Promise.reject('auth error')
    }
    return Promise.resolve(this.user as User)
  }

  public getFromCache(): User {
    if (this.user === null) {
      throw new Error('auth error')
    }
    return this.user
  }

  public authenticated(): boolean {
    if (!this.isInitalized) {
      return false
    }
    return this.user !== null
  }

  public login(): Promise<User> {
    return new Promise(async resolve => {
      if (!this._skipAuth) {
        await this.sleep(1000)
      }
      this.user = {
        id: 'dummyId' as UserId,
        email: 'dummy@sample.com' as Mail,
        displayName: 'dummy user' as DisplayName
      } as User
      resolve(this.user)
    })
  }

  public async logout(): Promise<void> {
    if (!this._skipAuth) {
      await this.sleep(800)
    }
    this.user = null
  }

  private sleep(msec: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}