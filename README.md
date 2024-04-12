# timeup-tools
タスク管理と習慣管理をするツール群。timeupは(時間を上手に使うという意味)造語。

## プロジェクト構成

```
.
├── apps
│   ├── standalone-client   : electron-app
│   └── web                 : nuxt3 project
│
└── packages
    ├── core                : core package
    ├── inmemory-infra      : in-memory repository
    ├── indexeddb-infra     : indexeddb repository
    └── firebase-infra      : firebase-auth & firestore repository
```

## モジュールの追加方法

```bash
$ mkdir packages/モジュール名
$ cd packages/モジュール名
$ pnpm init

# package.jsonのnameを設定する
# name: "@timeup-tools/モジュール名"

# at root directory
$ pnpm -F @timeup-tools/モジュール名 add @timeup-tools/参照するモジュール名 -E

# TypeScript
# at module directory
$ pnpm add -D typescript@5.2.2
# create tsconfig.json
$ pnpm tsc --init
```

## 各モジュールのフォルダ構成

```
.
├── src                 : プロダクションコード
│
├── test                : テストコード
│   └── tsconfig.json   : テストコードのtypescript設定
│
├── jest.config.js      : jestの設定ファイル
├── package.json        : `exports`はsrc配下を直接指定
└── tsconfig.json       : プロダクションコードのtypescript設定
```

## importのルール

* src配下は相対パスを使用
    * 理由: ビルドはapps側でするため
* test配下は`@`エイリアスを使用
    * test/tsconfig.jsonに設定

## ユニットテスト

```bash
# 全てのjest実行
$ pnpm run test

# jest: カバレッジの出力 -> coverage/lcov-report/index.html
$ pnpm run test:coverage
```
