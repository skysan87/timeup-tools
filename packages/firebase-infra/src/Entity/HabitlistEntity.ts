import { UserId } from "@timeup-tools/core/value-object"
import { FirebaseField } from "./common"

export type HabitlistEntity = FirebaseField & {
  userId: UserId
  maxIndex: number
}
