import { firestore, auth } from "./AppSetting"

import { connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'

export function startEmulator() {
  // TODO: ローカルネットワークではデバッグ実行時にアクセスできない
  connectFirestoreEmulator(firestore, 'localhost', 8080)
  connectAuthEmulator(auth, 'http://localhost:9099')
}