import { DateNumber, Nominal, TaskState, TaskType, UserId } from "../ValueObject";
import { SubTask } from "./SubTask";

export type Task = Nominal<{
  id: string // random
  type: TaskType
  title: string | null
  state: TaskState
  detail: string | undefined
  startdate: DateNumber | null
  enddate: DateNumber | null
  orderIndex: number
  /** TasklistId か HabitId */
  listId: string // TODO: ユニーク名
  userId: UserId
  lastActivityDate: DateNumber | null
  stateChangeDate: DateNumber | null
  createdAt: Date | null
  updatedAt: Date | null
  subTasks: SubTask[]
}, 'Task'>