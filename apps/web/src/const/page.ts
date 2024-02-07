export const MainPage = {
  Task: 'todolist',
  Habit: 'habit',
  Today: 'today',
  Gantt: 'gantt'
} as const satisfies Record<string, string>

export type MainPage = typeof MainPage[keyof typeof MainPage]

export const TodayPage = {
  List: 'list',
  InProgress: 'inprogress'
} as const satisfies Record<string, string>

export type TodayPage = typeof TodayPage[keyof typeof TodayPage]

export const TodayPageLabel = {
  [TodayPage.List]: '今日のタスク',
  [TodayPage.InProgress]: '作業中のタスク'
} as const satisfies Record<string, string>

export type TodayPageLabel = typeof TodayPageLabel[keyof typeof TodayPageLabel]

export const HabitPage = {
  Today: 'today',
  Active: 'active',
  All: 'all'
} as const satisfies Record<string, string>

export type HabitPage = typeof HabitPage[keyof typeof HabitPage]

export const HabitPageLabel = {
  [HabitPage.Today]: '今日',
  [HabitPage.Active]: '有効のみ',
  [HabitPage.All]: '全て',
} as const satisfies Record<string, string>

export type HabitPageLabel = typeof HabitPageLabel[keyof typeof HabitPageLabel]
