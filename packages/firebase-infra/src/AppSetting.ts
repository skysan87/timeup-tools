// @ts-ignore
import config from './config/app.config.js'
import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { clearIndexedDbPersistence, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore'

const firebaseApp = !getApps().length ? initializeApp(config) : getApp()

export const firestore = initializeFirestore(firebaseApp,
  {
    localCache:
      persistentLocalCache({ tabManager: persistentSingleTabManager({}) })
  })

clearIndexedDbPersistence(firestore)

export const auth = getAuth(firebaseApp)