import { Habit } from "@/Domain/Model/Habit"
import { Frequnecy, FullYear, Weekdays, MonthlyType, ZippedData, HexNumber, Array12 } from "@/Domain/ValueObject"
import { HabitBehavior } from "@/Domain/Behavior/HabitBehavior"
import { IBehavior } from "@/Domain/Behavior/IBehavior"
import * as DateUtil from "@/Util/DateUtil"
import DateWrapper from "@/lib/DateWrapper"

describe('HabitBehavior #format', () => {
  const TEST_DAY = 20221001 // 土曜
  jest.spyOn(DateUtil, "dateFactory").mockImplementation((date?, format?) => new DateWrapper(date ?? TEST_DAY, format))

  test('データ生成', () => {
    const habit = new HabitBehavior({} as Habit).format()
    const year = 2022 as FullYear
    const zippedData: ZippedData = {
      [year]: ['0','0','0','0','0','0','0','0','0','0','0','0'] as Array12<HexNumber>
    }

    expect(habit).toStrictEqual({
      id: undefined,
      rootId: undefined,
      title: null,
      detail: null,
      isActive: false,
      frequency: Frequnecy.DAILY,
      weekdays: [],
      monthlyType: null,
      planDays: [],
      planWeek: null,
      orderIndex: 0,
      userId: null,
      lastActivityDate: null,
      totalCount: 0,
      totalActivityCount: 0,
      duration: 0,
      maxduration: 0,
      summaryUpdatedAt: null,
      plan: zippedData,
      result: zippedData,
      createdAt: null,
      updatedAt: null,
      needServerUpdate: false,
      isPlanDay: false
    })

  })
})

describe('HabitBehavior #action', () => {
  const TEST_DAY = 20221001 // 土曜
  jest.spyOn(DateUtil, "dateFactory").mockImplementation((date?, format?) => new DateWrapper(date ?? TEST_DAY, format))

  test('初回の実施予定の集計ができること', () => {

    const data: Habit = {
      id: '',
      rootId: '',
      title: '毎日実施するタスク',
      frequency: Frequnecy.DAILY,
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 9, 1) // 2022/10/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // 今日の実施予定日が`1`になっていること
    // 16進数の値 一日なら 1100....0(32文字) -> c0000000(8文字)
    const thisMonthPlan = result.plan[year as FullYear][month]
    expect(thisMonthPlan).toBe('c0000000')

    // 今日が実施予定日である
    expect(result.isPlanDay).toBe(true)
  })

  test('繰り返し: 2022年9月の毎週の水・木のタスク', () => {
    // 最終更新日(summaryUpdatedAt)が8/31で10/1に更新
    // 9月分の更新の実施予定日を更新する
    const data: Habit = {
      id: '',
      rootId: '',
      title: '毎週の水・木のタスク',
      frequency: Frequnecy.WEEKLY,
      weekdays: [Weekdays.WEDNESDAY, Weekdays.THURSDAY],
      summaryUpdatedAt: 20220830,
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 8, 1) // 2022/09/01
    const year = today.getFullYear()
    const month = today.getMonth() // 8 = 9月

    // 9月分の実施予定日が計算されていること
    const lastMonthPlan = result.plan[year as FullYear][month]
    expect(lastMonthPlan).toBe('c183060c')

    // 2022/10/1は土曜日なので対象日でない
    expect(result.isPlanDay).toBe(false)
  })

  test('毎月1日のタスクで10/1が設定されること', () => {
    // 最終更新日(summaryUpdatedAt)が8/31で10/1に更新
    // 9/1-10/1までの更新の実施予定日を更新する
    const data: Habit = {
      id: '',
      rootId: '',
      title: '毎月1日のタスク',
      frequency: Frequnecy.MONTHLY,
      monthlyType: MonthlyType.DAY,
      planDays: [1],
      summaryUpdatedAt: 20220831,
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 9, 1) // 2022/10/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // - 10月の実施予定日が計算されていること
    const thisMonthPlan = result.plan[year as FullYear][month]
    expect(thisMonthPlan).toBe('c0000000')

    // 2022/10/1は対象日
    expect(result.isPlanDay).toBe(true)
  })

  test('毎月31日のタスクで9月分が設定されないこと', () => {
    // NOTE: 9月31日はない
    // 最終更新日(summaryUpdatedAt)が8/31で10/1に更新
    // 9/1-10/1までの更新の実施予定日を更新する
    const data: Habit = {
      id: '',
      rootId: '',
      title: '毎月31日のタスク',
      frequency: Frequnecy.MONTHLY,
      monthlyType: MonthlyType.DAY,
      planDays: [31],
      summaryUpdatedAt: 20220831,
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 8, 1) // 2022/9/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // - 9月の実施予定日が計算されていること
    const lastMonthPlan = result.plan[year as FullYear][month]
    expect(lastMonthPlan).toBe('80000000')

    // 2022/10/1は対象日でない
    expect(result.isPlanDay).toBe(false)
  })

  test('毎月月末のタスクで9/30が設定されること', () => {
    // 最終更新日(summaryUpdatedAt)が8/31で10/1に更新
    // 9/1-10/1までの更新の実施予定日を更新する
    const data: Habit = {
      id: '',
      rootId: '',
      title: '月末のタスク',
      frequency: Frequnecy.MONTHLY,
      monthlyType: MonthlyType.END,
      summaryUpdatedAt: 20220831,
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 8, 1) // 2022/9/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // 9月の実施予定日が計算されていること
    const lastMonthPlan = result.plan[year as FullYear][month]
    expect(lastMonthPlan).toBe('80000002')

    // 2022/10/1は対象日でない
    expect(result.isPlanDay).toBe(false)
  })

  test('毎月第一土曜日のタスクで10/1が設定されること', () => {
    // 最終更新日(summaryUpdatedAt)が8/31で10/1に更新
    // 9/1-10/1までの更新の実施予定日を更新する
    const data: Habit = {
      id: '',
      rootId: '',
      title: '第一土曜日のタスク',
      frequency: Frequnecy.MONTHLY,
      monthlyType: MonthlyType.WEEK,
      planWeek: { index: 1, day: Weekdays.SATURDAY },
      summaryUpdatedAt: 20220831,
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 9, 1) // 2022/10/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // 10月の実施予定日が計算されていること
    const thisMonthPlan = result.plan[year as FullYear][month]
    expect(thisMonthPlan).toBe('c0000000')

    // 2022/10/1は対象日
    expect(result.isPlanDay).toBe(true)
  })

  test('年越し', () => {
    // 最終更新日(summaryUpdatedAt)が2021/12/31で2022/10/1に更新
    const data: Habit = {
      id: '',
      rootId: '',
      title: '毎月1日のタスク',
      frequency: Frequnecy.MONTHLY,
      monthlyType: MonthlyType.DAY,
      planDays: [1],
      summaryUpdatedAt: 20211231,
      plan: {
        [2021 as FullYear]: Array.from({ length: 12 }, () => 'c0000000')
      },
      isActive: true
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateData()
    })

    const today = new Date(2022, 9, 1) // 2022/10/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // 10月の実施予定日が計算されていること
    const thisMonthPlan = result.plan[year as FullYear][month]
    expect(thisMonthPlan).toBe('c0000000')

    // 2022/10/1は対象日
    expect(result.isPlanDay).toBe(true)
  })
})
