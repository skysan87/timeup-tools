import { UserId } from "@timeup-tools/core/value-object"
import { FirebaseField } from "./common"

export type TasklistEntity = FirebaseField & {
  title: string
  detail: string
  userId: UserId
  maxIndex: number
  orderIndex: number
}
