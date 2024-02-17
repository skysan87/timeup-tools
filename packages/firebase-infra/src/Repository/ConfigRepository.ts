import { firestore } from "@/AppSetting"
import { toConfigEntity } from "@/Converter"
import { Config } from "@timeup-tools/core/model"
import { IConfigRepository } from "@timeup-tools/core/repository"
import { UserId } from "@timeup-tools/core/value-object"
import { CollectionReference, DocumentData, QuerySnapshot, collection, doc, getDocsFromCache, getDocsFromServer, limit, query, where } from "firebase/firestore"
import { scope } from "./Transaction"

export class ConfigRepository implements IConfigRepository {

  private getRef(userId: UserId): CollectionReference {
    // TODO: 将来的にuserIdに変更する(userIdを利用)
    return collection(firestore, 'configs')
  }

  public async get(userId: UserId): Promise<Config | null> {
    const q = query(this.getRef(userId)
      , where('userId', '==', userId)
      , limit(1)
    )

    let querySnapshot: QuerySnapshot

    try {
      querySnapshot = await getDocsFromCache(q)
    } catch (error) {
      querySnapshot = await getDocsFromServer(q)
    }

    if (querySnapshot.empty || querySnapshot.size === 0) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return this.convert(doc.id, doc.data())
  }

  public async save(userId: UserId, data: Config): Promise<Config> {
    const entity = toConfigEntity(data)

    const newDocRef = doc(this.getRef(userId))
    await scope.set(newDocRef, entity)

    const systemDate = new Date()
    const newData = structuredClone(data)
    newData.id = newDocRef.id
    newData.createdAt = systemDate
    newData.updatedAt = systemDate
    return newData
  }

  public async update(userId: UserId, data: Partial<Config>): Promise<Config> {
    const docRef = doc(this.getRef(userId), data.id!)
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