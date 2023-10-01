import { IBehavior } from "./IBehavior"

export abstract class BehaviorBase<T> implements IBehavior<T> {

  constructor(protected value: T) { }

  public abstract format(): T

  public get<K extends keyof T>(key: K): T[K] {
    return this.value[key]
  }

  public update(input: Partial<T>): void {
    this.value = {
      ...this.value,
      ...input
    }
  }

  public action(callback: (behavior: IBehavior<T>) => void): T {
    this.value = this.format()
    callback(this)
    return this.value
  }

  public async actionAsync(callback: (behavior: IBehavior<T>) => Promise<void>): Promise<T> {
    this.value = this.format()
    await callback(this)
    return this.value
  }
}