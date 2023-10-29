export class ValidateError<T> extends Error {

  private _fields: Map<string, string> = new Map<string, string>()

  constructor() {
    super()
  }

  public set<K extends keyof T>(key: K, value: string) {
    this._fields.set(key as string, value)
  }

  public get<K extends keyof T>(key: K): string {
    return this._fields.get(key as string) ?? ''
  }

  public get hasError() {
    return this._fields.size > 0
  }
}