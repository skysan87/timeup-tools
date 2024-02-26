import { UserId } from "../ValueObject"

export interface ITransactionScope {
  get userId(): UserId
}

export interface ITransaction {
  // NOTE: 実装でITransactionScopeを指定するオブジェクトのフラグ管理をする

  /**
   * 関連オブジェクトの参照・追加・更新・削除する場合に使用
   * @param callback
   */
  run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void>
  /**
   * 複数オブジェクトの追加・更新・削除する場合に使用
   * @param callback
   */
  runBatch(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void>
}