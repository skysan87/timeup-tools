import { UserId } from "@timeup-tools/core/value-object"
import { FirebaseField } from "./common"

export type TasklistEntity = FirebaseField & {
  title: string | null
  detail: string | null
  userId: UserId
  maxIndex: number
  orderIndex: number
}
