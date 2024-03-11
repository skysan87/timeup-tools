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

```bash
# 全てのjest実行
$ pnpm run test

# jest: カバレッジの出力 -> core/coverage/lcov-report/index.html
$ pnpm run test:coverage

# ファイル単体の実行例
$ pnpm run test test/Domain/Behavior/HabitBehavior.test.ts
```

* ファイル内で指定したもののみ実行する場合
  * describe.only()
  * test.only()
* ファイル内で指定したものをスキップする場合
  * describe.skip()
  * test.skip()