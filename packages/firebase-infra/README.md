## データ構造
(TBD)

## NOTE: DBのタイムスタンプ
* set, updateのtimestampには`firebase/firestore`の`serverTimestamp()`を利用している
* この時点でclient側はタイムスタンプを取得できないので、一時的にDateの値を設定する