import { CollectionReference, DocumentData, collection, doc, getDocs, limit, query, where } from "firebase/firestore"
import { Config } from "@timeup-tools/core/model"
import { IConfigRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { firestore } from "../AppSetting"
import { toConfigEntity } from "../Converter"
import { FirestoreTransactoinScope as Scope } from "../Repository/Transaction"

export class ConfigRepository implements IConfigRepository {

  private _id?: string

  public getId(): string {
    if (!this._id) {
      throw new Error('Config is not initialized.')
    }
    return this._id
  }

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的にuserIdに変更する(userIdを利用)
    return collection(firestore, 'configs')
  }

  public async get(scope: Scope): Promise<Config | null> {
    const q = query(this.getRef(scope.userId)
      , where('userId', '==', scope.userId)
      , limit(1)
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty || querySnapshot.size === 0) {
      return null
    }

    const doc = querySnapshot.docs[0]
    this._id = doc.id
    return this.convert(doc.id, doc.data())
  }

  public async save(scope: Scope, data: Config): Promise<Config> {
    const entity = toConfigEntity(data)

    const newDocRef = doc(this.getRef(scope.userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate

    this._id = newData.id

    return newData
  }

  public async update(scope: Scope, data: Partial<Config>): Promise<Config> {
    const docRef = doc(this.getRef(scope.userId), data.id!)
    const entity = toConfigEntity(data as Config)

    await scope.update(docRef, entity)
    const newData = structuredClone(data)
    newData.updatedAt = new Date()

    return newData as Config
  }

  private convert(id: string, data: DocumentData): Config {
    const config = { ...data, id } as Config
    config.createdAt = data.createdAt?.toDate() ?? ''
    config.updatedAt = data.createdAt?.toDate() ?? ''
    return config
  }
}