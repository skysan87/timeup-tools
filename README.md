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
$ mkdire packages/モジュール名
$ cd packages/モジュール名
$ pnpm init

# at root directory
$ pnpm -F モジュール名 add 参照するモジュール名 -E

# TypeScript
# at module directory
$ pnpm add -D typescript
# create tsconfig.json
$ pnpm tsc --init
```