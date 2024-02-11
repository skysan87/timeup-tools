// @ts-ignore
import config from './config/app.config.js'
import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseApp = !getApps().length ? initializeApp(config) : getApp()

export const firestore = getFirestore(firebaseApp)

export const auth = getAuth(firebaseApp)