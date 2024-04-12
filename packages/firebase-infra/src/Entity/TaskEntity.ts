import { DateNumber, TaskState, TaskType, UserId } from "@timeup-tools/core/value-object"
import { SubTask } from "@timeup-tools/core/model"
import { FirebaseField } from "./common"

export type TaskEntity = FirebaseField & {
  type: TaskType
  title: string | null
  state: TaskState
  detail: string | null
  startdate: DateNumber | null
  enddate: DateNumber | null
  orderIndex: number
  listId: string
  userId: UserId
  lastActivityDate: DateNumber | null
  stateChangeDate: DateNumber | null
  subTasks: SubTask[]
}