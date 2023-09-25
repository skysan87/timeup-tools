# timeup-tools
タスク管理と習慣管理をするツール群。timeupは(時間を上手に使うという意味)造語。

## プロジェクト構成

```
.
├── apps
│   ├── desktop-standalone  : electron-app
│   └── nuxt3-web           : nuxt3 project
│
└── packages
    ├── core                : core package
    ├── inmemory-infra      : in-memory repository
    ├── indexeddb-infra     : indexeddb repository
    └── firebase-infra      : firebase-auth & firestore repository
```