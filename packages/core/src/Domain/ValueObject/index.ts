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
export type DateNumber = Nominal<string, 'DateNumber'>

// 西暦: 4桁の数字
export type FullYear = Nominal<number, 'FullYear'>

export const Frequnecy = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
} as const

export type Frequnecy = typeof Frequnecy[keyof typeof Frequnecy]

export const MonthlyType = {
  DAY: 'day',
  WEEK: 'week',
  END: 'end'
} as const

export type MonthlyType = typeof MonthlyType[keyof typeof MonthlyType]

export const Weekdays = {
  0: '日', 1: '月', 2: '火', 3: '水', 4: '木', 5: '金', 6: '土'
} as const

export type Weekdays = typeof Weekdays[keyof typeof Weekdays]

export type Array12<T> = [T, T, T, T, T, T, T, T, T, T, T, T]

export type Array32<T> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]

export type HexNumber = Nominal<string, 'HexNumber'>

export type ZippedData = { [key: FullYear]: Array12<HexNumber> }

export type BinaryNumber = Nominal<'0' | '1', 'BinaryNumber'>

export type MonthlyFlag = Nominal<Array32<BinaryNumber>, 'MonthlyFlag'>

export type UnzippedData = { [key: FullYear]: Array12<MonthlyFlag> }

export const TaskType = {
  TODO: 'todo',
  HABIT: 'habit'
} as const

export type TaskType = typeof TaskType[keyof typeof TaskType]

export const TaskState = {
  Todo: 0,
  InProgress: 1,
  Done: 2
} as const

export type TaskState = typeof TaskState[keyof typeof TaskState]

export const TaskSateLabel = {
  [TaskState.Todo]: 'Todo',
  [TaskState.InProgress]: 'In Progress',
  [TaskState.Done]: 'Done'
} as const

export type TaskSateLabel = typeof TaskSateLabel[keyof typeof TaskSateLabel]
