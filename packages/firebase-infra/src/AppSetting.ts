// @ts-ignore
import config from './config/app.config.js'
import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { clearIndexedDbPersistence, getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore'

const firebaseApp = !getApps().length ? initializeApp(config) : getApp()

// TODO: オフライン利用は要検証
// export const firestore = initializeFirestore(firebaseApp,
//   {
//     localCache:
//       persistentLocalCache({ tabManager: persistentSingleTabManager({}) })
//   })

// clearIndexedDbPersistence(firestore)

export const firestore = getFirestore(firebaseApp)

export const auth = getAuth(firebaseApp)