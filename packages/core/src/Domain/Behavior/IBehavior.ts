export interface IBehavior<T> {
  format(): T
  get<K extends keyof T>(key: K): T[K]
  update(input: Partial<T>): void
  action(callback: (behavior: IBehavior<T>) => void): T
  actionAsync(callback: (behavior: IBehavior<T>) => Promise<void>): Promise<T>
}