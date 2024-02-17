## データ構造
(TBD)

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

## NOTE: DBのタイムスタンプ
* set, updateのtimestampには`firebase/firestore`の`serverTimestamp()`を利用している
* この時点でclient側はタイムスタンプを取得できないので、一時的にDateの値を設定する