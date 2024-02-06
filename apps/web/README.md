# Nuxt3 Project

## Setup

```bash
# at root directory
pnpm install -D tailwindcss postcss@latest -F @timeup-tools/web
pnpm install @fortawesome/vue-fontawesome@latest-3 -F @timeup-tools/web
pnpm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons -F @timeup-tools/web
pnpm install -D @nuxt/types -F @timeup-tools/web
pnpm install v-calendar@next @popperjs/core -F @timeup-tools/web
pnpm install -D cross-env -F @timeup-tools/web
pnpm install tailvue -F @timeup-tools/web
```

## Scripts
### 開発サーバ起動

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev:inmemory

# Network:  use --host to expose
pnpm run dev:inmemory --host
```

### ビルドの動作確認

`pnpm run preview`ではない

```bash
# pnpm
pnpm run dev:build
```

## 画面一覧

* ログイン
  * url: /login
  * 機能
    * ログイン
* 今日のタスク
  * url: /today/list
  * 機能
    * タスクの期限が開始日を過ぎているものを表示
* 作業中のタスク
  * url: /today/inprogress
  * 機能
    * 作業中のタスクを表示
* ガントチャート
  * url: /gantt
  * 機能
    * ガントチャートの表示
    * タスクの期限の編集
* プロジェクト
  * url: /todolist/[プロジェクトid]
  * 機能
    * タスクの作成・編集
    * タスク
      * 期限設定
      * プロジェクト設定
      * チェックリスト
      * リロード
      * 完了済みのタスクの一括削除
      * タスクの一括削除
      * タスクの期限一括変更
      * プロジェクト名編集
* 習慣: 今日
  * url: /habit/today
  * 機能
    * 今日が対象の習慣を表示
* 習慣: 有効のみ
  * url: /habit/active
  * 機能
    * 有効な状態の習慣を表示
* 習慣: 全て
  * url: /habit/all
  * 機能
    * 全ての習慣を表示

### サイドメニューの機能
* リロード
* ログアウト
* プロジェクトの追加・編集・削除
* ヘッダーメッセージの編集