import { Frequnecy, MonthlyType, Nominal, UserId, Weekdays, ZippedData } from "../ValueObject";

export type Habit = Nominal<{
  id: string // randam TODO:
  rootId: string // HabitlistId TODO:
  title: string | null
  detail: string | null
  isActive: boolean
  /** 繰り返し設定 */
  frequency: Frequnecy
  /** 実施する曜日 */
  weekdays: Weekdays[]
  /** 毎月実施する種別 */
  monthlyType?: MonthlyType
  /** 実施する日 */
  planDays: number[]
  /** 実施する週 */
  planWeek: { index: number, day: number }
  orderIndex: number
  userId: UserId
  /** 前回実施日 */
  lastActivityDate: Date | null
  /** 通算対象回数(分母) */
  totalCount: number
  /** 通算実施回数(分子) */
  totalActivityCount: number
  /** 継続期間 */
  duration: number
  /** 最長継続期間 */
  maxduration: number
  /** 実績更新日 */
  summaryUpdatedAt: Date | null
  /** 実施予定日 */
  plan: ZippedData
  /** 実績 */
  result: ZippedData
  /** 実績の更新確認用 */
  needServerUpdate: false
  // TODO: デコレータで表示用と明示
  /** 今日が実施日か */
  isPlanDay: boolean
  createdAt: Date | null
  updatedAt: Date | null
}, 'Habit'>