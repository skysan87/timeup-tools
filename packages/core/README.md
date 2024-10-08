## 機能

* 認証
* プロジェクト管理
  * 今日のタスク
  * 作業中のタスク
  * ガントチャート
  * デイリースケジュール
  * タスク登録
    * ステータス
    * サブタスク
    * 期間
  * 一括操作
    * 期限
    * 削除
    * プロジェクト移動
* 習慣管理
  * 繰り返し設定
  * 実績記録
* ヘッダーメッセージ

## ユニットテスト

* coreモジュールでテストするもの
  * Domain/Behavior
  * Domain/Model
  * Domain/ValueObject
  * Util
* UseCase -> apps/unit-testerで実施
* Repository -> 各infraモジュールで実施

```bash
# 全てのjest実行
$ pnpm run test

# ファイル単体の実行例
$ pnpm run test test/Domain/Behavior/HabitBehavior.test.ts
```

* ファイル内で指定したもののみ実行する場合
  * describe.only()
  * test.only()
* ファイル内で指定したものをスキップする場合
  * describe.skip()
  * test.skip()

### メモ
* 非同期メソッド(async/await)の例外評価をする場合
  * `expect(例外が発生するメソッド).rejects.toThrowError(対象のエラーオブジェクト)`
  * rf. TaskBehavior.test.ts #バリデーションエラー