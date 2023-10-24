import { DateNumber, Frequnecy, MonthlyType, Nominal, UserId, Weekday, ZippedData } from "../ValueObject"

export type Habit = Nominal<{
  id: string // randam TODO:
  rootId: string // HabitlistId TODO:
  title: string
  detail: string
  isActive: boolean
  /** 繰り返し設定 */
  frequency: Frequnecy
  /** 実施する曜日 */
  weekdays: Weekday[]
  /** 毎月実施する種別 */
  monthlyType: MonthlyType | null
  /** 実施する日(Frequnecy.MONTHLY && MonthlyType.DAY) */
  planDays: Weekday[]
  /**
   * @param planWeek 実施する週 (Frequnecy.MONTHLY && MonthlyType.WEEK)
   * @param planWeek.index 第N周
   * @param planWeek.day 曜日(0-6)
  */
  planWeek: { index: number, day: Weekday } | null
  orderIndex: number
  userId: UserId
  /** 前回実施日 */
  lastActivityDate: DateNumber | null
  /** 通算対象回数(分母) */
  totalCount: number
  /** 通算実施回数(分子) */
  totalActivityCount: number
  /** 継続期間 */
  duration: number
  /** 最長継続期間 */
  maxduration: number
  /** 実績更新日 */
  summaryUpdatedAt: DateNumber | null
  /** 実施予定日 */
  plan: ZippedData
  /** 実績 */
  result: ZippedData
  /** 実績の更新確認用 */
  needServerUpdate: boolean
  // TODO: デコレータで表示用と明示
  /** 今日が実施日か */
  isPlanDay: boolean
  createdAt: Date | null
  updatedAt: Date | null
}, 'Habit'>