# UseCase

## 機能

* コントローラ(WebUI, CLI)向けにビジネスロジックのIFを提供する

* データの更新・削除時はBehaviorを利用する
  * 理由: 計算処理やundefinedなプロパティに初期値を確実に設定するため
  * 利用例

  ```typescript
  // Behaviorは初期値の設定、データの計算処理をした値を提供する
  const task: task = new TaskBehavior({...taskProps} as Task)
    .action((behavior: IBehavior<Task>) => {
      // プロパティの取得
      const title = behavior.get('title')
      // プロパティの更新
      behavior.update({ 'title': title + '_updated' })
    }
  )
  ```

* TODO: Decoratorで実装必須にする