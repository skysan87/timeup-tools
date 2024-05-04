# クライアントとサーバ間のデータ同期フロー

## 目的
* 全文検索
* アプリ起動高速化: 同期はバックグラウンドで行う

## 設計
* CQRS方式に変更
  * QueryとCommandに分ける
  * Readを完全にQueryのみにはしない
    * 更新時にサーバから取得するケースがあるため
  * LocalDBへの反映は(Event→Queue)
  * Deleteは論理削除
* 全体同期は起動時のみ

## 起動時同期シーケンス

```mermaid
sequenceDiagram
  participant 1 as Client
  participant 2 as LocalDB
  participant 3 as ServerDB

  1->>1: 同期開始
  1->>2: 前回同期時刻を取得
  1->>3: 前回の更新以降のデータ取得
  1->>2: 取得したデータで更新
  1->>2: 前回同期開始時刻を更新
  1->>1: 同期終了
```

## データ更新時シーケンス

```mermaid
sequenceDiagram
  participant 1 as Client
  participant 2 as LocalDB
  participant 3 as ServerDB

  1->>3: データ登録
  alt is 成功
    3->>1: 成功(新規IDを返却)
    1->>2: データ登録(Event駆動)
    1->>1: 画面更新
  else is 失敗
    3->>1: 失敗
  end
```