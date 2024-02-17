export interface ITransactionScope {
  value: any
}

export interface ITransaction {
  // NOTE: 実装でITransactionScopeを指定するオブジェクトのフラグ管理をする

  /**
   * 関連オブジェクトの参照・追加・更新・削除する場合に使用
   * @param callback
   */
  run(callback: () => Promise<void>): Promise<void>
  /**
   * 複数オブジェクトの追加・更新・削除する場合に使用
   * @param callback
   */
  runBatch(callback: () => Promise<void>): Promise<void>
}