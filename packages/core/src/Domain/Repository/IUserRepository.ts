import { User } from "../Model/User"

export interface IUserRepository {
  authenticated(): Promise<boolean>
  get(): Promise<User>
  getFromCache(): User
  login(): Promise<User>
  logout(): Promise<void>
}