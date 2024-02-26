import { UserId } from "@timeup-tools/core/value-object"
import { FirebaseField } from "./common"

export type ConfigEntity = FirebaseField & {
  userId: UserId
  globalMessage: string
}