import { User } from "../Model/User"

export interface IUserRepository {
  /**
   * ログイン済みか
   * @description 初期化処理後に呼ばれるように実装
   */
  authenticated(): boolean
  /**
   * 初期化処理
   */
  initalize(): Promise<void>
  get(): Promise<User>
  getFromCache(): User
  login(): Promise<User>
  logout(): Promise<void>
}