import { AbstractStorage } from "./AbstractStorage"

export class SessionStorage extends AbstractStorage {

  public get(key: string): any {
    const jsonStr = sessionStorage.getItem(key)
    return !jsonStr ? null : JSON.parse(jsonStr)
  }

  public save(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data))
  }

  public delete(key: string): void {
    sessionStorage.removeItem(key)
  }
}