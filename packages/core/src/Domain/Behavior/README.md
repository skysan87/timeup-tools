# Behavior

Modelの振る舞いを実装する。

## 機能

### format(): T

データを整える。

### get<K extends keyof T>(key: K): T[K]

Modelのプロパティの値を取得する。

### update(input: T): void

データを更新する。

### action(callback: (behavior: IBehavior<T>) => void): T

データを操作するの振る舞いをコールバックに記述する。

### actionAsync(callback: (behavior: IBehavior<T>) => Promise<void>): Promise<T>

データを操作するの振る舞いをコールバックに記述する。
