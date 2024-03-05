import { User } from "@timeup-tools/core/model"
import { IUserRepository } from "@timeup-tools/core/repository"
import { SessionStorage } from "../Storage/SessionStorage"
import { DisplayName, Mail, UserId } from "@timeup-tools/core/value-object"

export class SessionUserRepository implements IUserRepository {

  private static readonly KEY: string = 'USER'

  private user: User | null = null

  private isInitalized: boolean = false

  private scope = new SessionStorage('' as UserId)

  public authenticated(): boolean {
    if (!this.isInitalized) {
      return false
    }
    return this.user !== null
  }

  /**
   * ログイン後のリロードであれば、ログイン情報を保持する
   */
  public async initalize(): Promise<void> {
    await this.sleep(500)
    this.user = this.scope.get(SessionUserRepository.KEY) as User
    this.isInitalized = true
  }

  public async get(): Promise<User> {
    if (!this.authenticated()) {
      return Promise.reject('auth error')
    }
    return Promise.resolve(this.scope.get(SessionUserRepository.KEY) as User)
  }

  public getFromCache(): User {
    if (this.user === null) {
      throw new Error('auth error')
    }
    return this.user
  }

  public async login(): Promise<User> {
    return new Promise(async resolve => {
      await this.sleep(1000)
      this.user = {
        id: 'dummyId' as UserId,
        email: 'dummy@sample.com' as Mail,
        displayName: 'dummy user' as DisplayName
      } as User
      this.scope.save(SessionUserRepository.KEY, this.user)
      resolve(this.user)
    })
  }

  public async logout(): Promise<void> {
    await this.sleep(800)
    this.scope.delete(SessionUserRepository.KEY)
    this.user = null
  }

  private sleep(msec: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}