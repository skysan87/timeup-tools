import { setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, UserCredential, User, getAuth } from "firebase/auth"
import { User as UserModel } from "@timeup-tools/core/model"
import { IUserRepository } from "@timeup-tools/core/repository"
import { DisplayName, Mail, UserId } from "@timeup-tools/core/value-object"
import { auth } from "../AppSetting"

export class UserRepository implements IUserRepository {

  private isInitalized: boolean = false

  constructor() {
    setPersistence(auth, browserLocalPersistence)
  }

  private get _user(): UserModel | null {
    return auth.currentUser
      ? this.convert(auth.currentUser)
      : null
  }

  public async initalize(): Promise<void> {
    await this.getAuthChanged()
    this.isInitalized = true
  }

  public authenticated(): boolean {
    if (!this.isInitalized) {
      return false
    }
    return this._user !== null
  }

  public async get(): Promise<UserModel> {
    if (this._user === null) {
      throw new Error('auth error')
    }
    return this._user
  }

  public getFromCache(): UserModel {
    if (this._user === null) {
      throw new Error('auth error')
    }
    return this._user
  }

  public async login(): Promise<UserModel> {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    if (!this._user) {
      throw new Error('[Firebase] login failed.')
    } else {
      return this._user
    }
  }

  public async logout(): Promise<void> {
    // TODO: clear cache
    await signOut(auth)
  }

  private getAuthChanged(): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth,
        user => {
          unsubscribe()
          resolve(this._user)
        },
        err => reject(err)
      )
    })
  }

  private convert(user: User): UserModel {
    return {
      id: user.uid as UserId,
      email: user.email as Mail,
      displayName: user.displayName as DisplayName
    } as UserModel
  }
}