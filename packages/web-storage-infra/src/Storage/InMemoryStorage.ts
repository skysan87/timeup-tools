import { AbstractStorage } from "./AbstractStorage"

export class InMemoryStorage extends AbstractStorage {

  private static memory = new Map()

  public get(key: string): any {
    return InMemoryStorage.memory.get(key) ?? null
  }

  public save(key: string, data: any): void {
    InMemoryStorage.memory.set(key, data)
  }

  public delete(key: string): void {
    InMemoryStorage.memory.delete(key)
  }

  public static clear(): void {
    // for unit-test
    InMemoryStorage.memory.clear()
  }
}