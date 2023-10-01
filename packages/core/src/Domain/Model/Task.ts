import { DateNumber, Nominal, TaskState, TaskType, UserId } from "../ValueObject";
import { SubTask } from "./SubTask";

export type Task = Nominal<{
  id: string // random
  type: TaskType
  title: string
  state: TaskState
  detail: string
  startdate: DateNumber
  enddate: DateNumber
  orderIndex: number
  /** TasklistId か HabitId */
  listId: string // TODO: ユニーク名
  userId: UserId
  lastActivityDate: DateNumber | null
  stateChangeDate: DateNumber | null
  createdAt: Date | null
  updatedAt: Date | null
  /** リスト名: 表示用 */
  listName: string
  subTasks: SubTask[]
  isDone: boolean // getter
}, 'Task'>