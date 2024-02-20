import { DateNumber, Frequnecy, MonthlyType, UserId, Weekday, ZippedData } from "@timeup-tools/core/value-object"
import { FirebaseField } from "./common"

export type HabitEntity = FirebaseField & {
  rootId: string
  title: string
  detail: string
  isActive: boolean
  frequency: Frequnecy
  weekdays: Weekday[]
  monthlyType: MonthlyType | null
  planDays: number[]
  planWeek: { index: number, day: Weekday } | null
  orderIndex: number
  userId: UserId
  lastActivityDate: DateNumber | null
  totalCount: number
  totalActivityCount: number
  duration: number
  maxduration: number
  summaryUpdatedAt: DateNumber | null
  plan: ZippedData
  result: ZippedData
}