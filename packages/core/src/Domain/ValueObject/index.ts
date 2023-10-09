/**
 * 同一プロパティを持つ型定義の区別のために利用
 * @param U type名
 */
export type Nominal<T, U extends string> = T & { __brand: U }

// TODO: implement assert-function

export type UserId = Nominal<string, 'UserId'>

export type Mail = Nominal<string, 'Mail'>

export type DisplayName = Nominal<string, 'DisplayName'>

/** YYYYMMDD */
export type DateNumber = Nominal<number, 'DateNumber'>

// 西暦: 4桁の数字
export type FullYear = Nominal<number, 'FullYear'>

/** 繰り返し設定 */
export const Frequnecy = {
  /** 毎日 */
  DAILY: 'daily',
  /** 毎週 */
  WEEKLY: 'weekly',
  /** 毎月 */
  MONTHLY: 'monthly'
} as const satisfies { [key: string]: string }

export type Frequnecy = typeof Frequnecy[keyof typeof Frequnecy]

/** 毎月の繰り返し設定 */
export const MonthlyType = {
  /** 特定の日付 */
  DAY: 'day',
  /** 特定の週 */
  WEEK: 'week',
  /** 月末 */
  END: 'end'
} as const satisfies { [key: string]: string }

export type MonthlyType = typeof MonthlyType[keyof typeof MonthlyType]

export type Weekday = Nominal<number, 'Weekday'>

export const Weekdays = {
  SUNDAY: 0 as Weekday,
  MONDAY: 1 as Weekday,
  TUESDAY: 2 as Weekday,
  WEDNESDAY: 3 as Weekday,
  THURSDAY: 4 as Weekday,
  FRIDAY: 5 as Weekday,
  SATURDAY: 6 as Weekday
} as const satisfies Record<string, Weekday>

export type Weekdays = typeof Weekdays[keyof typeof Weekdays]

export const WeekdaysLabel = {
  [Weekdays.SUNDAY]: '日',
  [Weekdays.MONDAY]: '月',
  [Weekdays.TUESDAY]: '火',
  [Weekdays.WEDNESDAY]: '水',
  [Weekdays.THURSDAY]: '木',
  [Weekdays.FRIDAY]: '金',
  [Weekdays.SATURDAY]: '土'
} as const satisfies Record<Weekday, string>

export type WeekdaysLabel = typeof WeekdaysLabel[keyof typeof WeekdaysLabel]

export type Array12<T> = [T, T, T, T, T, T, T, T, T, T, T, T]

export type Array32<T> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]

export type HexNumber = Nominal<string, 'HexNumber'>

export type ZippedData = { [key: FullYear]: Array12<HexNumber> }

export const Flag = { ON: '1', OFF: '0' } as const

export type Flag = typeof Flag[keyof typeof Flag]

export type UnzippedData = { [key: FullYear]: Array12<Array32<Flag>> }

export const TaskType = {
  TODO: 'todo',
  HABIT: 'habit'
} as const satisfies { [key: string]: string }

export type TaskType = typeof TaskType[keyof typeof TaskType]

export const TaskState = {
  Todo: 0,
  InProgress: 1,
  Done: 2
} as const satisfies { [key: string]: number }

export type TaskState = typeof TaskState[keyof typeof TaskState]

export const TaskSateLabel = {
  [TaskState.Todo]: 'Todo',
  [TaskState.InProgress]: 'In Progress',
  [TaskState.Done]: 'Done'
} as const satisfies { [key: number]: string }

export type TaskSateLabel = typeof TaskSateLabel[keyof typeof TaskSateLabel]
