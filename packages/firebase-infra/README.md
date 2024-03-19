## 初期設定
* config/app.config.jsを作成
* firebase consoleから構成オブジェクトを記載する

```json
export default {
  projectId: "",
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  appId: ""
}
```

## 利用しているFirebaseの機能
* Hosting
* Authentication
* Firestore Database

## エミュレータ設定

`firebase-tools`を事前にインストールする。

```bash
$ pnpm firebase init

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /***/timeup-tools/packages/firebase-infra

? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your
 choices. (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◯ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
 ◯ Hosting: Set up GitHub Action deploys
 ◯ Storage: Configure a security rules file for Cloud Storage
❯◉ Emulators: Set up local emulators for Firebase products
 ◯ Remote Config: Configure a template file for Remote Config
 ◯ Extensions: Set up an empty Extensions manifest
 ◯ Frameworks: Get started with Frameworks projects.

(省略)

=== Emulators Setup
? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your choices. (Press
<space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◉ Authentication Emulator
 ◯ Functions Emulator
❯◉ Firestore Emulator
 ◯ Database Emulator
 ◯ Hosting Emulator
 ◯ Pub/Sub Emulator
 ◯ Storage Emulator

(省略)

=== Emulators Setup
? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your choices.
Authentication Emulator, Firestore Emulator
? Which port do you want to use for the auth emulator? 9099
? Which port do you want to use for the firestore emulator? 8080
? Would you like to enable the Emulator UI? Yes
? Which port do you want to use for the Emulator UI (leave empty to use any available port)? 8081
? Would you like to download the emulators now? Yes
```

## firestore構成

* configs
  * documentId: ランダム
    * createdAt: timestamp
    * updatedAt: timestamp
    * globalMessage: string
    * userId: string

* habits
  * documentId: ランダム
    * createdAt: timestamp
    * updatedAt: timestamp
    * maxIndex: number
    * userId: string
    * habits: collection
      * documentId: ランダム
        * createdAt: timestamp
        * updatedAt: timestamp
        * detail: string
        * duration: number
        * frequency: string
        * isActive: boolean
        * lastActivityDate: number(YYYYMMDD)
        * maxduration: number
        * monthlyType: string
        * orderIndex: number
        * plan: map<number, Array<string>>
          * key: YYYY(西暦年)
          * value: Array<string>(要素数12, 8桁の16進数)
        * planDays: Array<number>(日付)
        * planWeek: map
          * day: number
          * index: number
        * result: map<number, Array<string>>
          * key: YYYY(西暦年)
          * value: Array<string>(要素数12, 8桁の16進数)
        * rootId: string
        * summaryUpdatedAt: number(YYYYMMDD)
        * title: string
        * totalActivityCount: number
        * totalCount: number
        * updatedAt: timestamp
        * userId: string
        * weekdays: Array<string>(曜日のindex(0-6))

* todos
  * documentId: ランダム
    * createdAt: timestamp
    * updatedAt: timestamp
    * detail: string
    * enddate: number(YYYYMMDD)
    * lastActivityDate: number(YYYYMMDD)
    * listId: string
    * orderIndex: number
    * startdate: number(YYYYMMDD)
    * state: number
    * stateChangeDate: number(YYYYMMDD)
    * subtasks: Array<Object>
      * isDone: boolean
      * title: string
    * title: string
    * type: string
    * userId: string

* lists
  * documentId: ランダム
    * createdAt: timestamp
    * updatedAt: timestamp
    * deleteFlag: boolean
    * detail: string
    * maxIndex: number
    * orderIndex: number
    * title: string
    * userId: string

## NOTE: DBのタイムスタンプ
* set, updateのtimestampには`firebase/firestore`の`serverTimestamp()`を利用している
* この時点でclient側はタイムスタンプを取得できないので、一時的にDateの値を設定する