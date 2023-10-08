import { dateFactory } from "@/Util/DateUtil"
import { Habit } from "@/Domain/Model/Habit"
import { Frequnecy, FullYear, Weekdays } from "@/Domain/ValueObject"
import { HabitBehavior } from "@/Domain/Behavior/HabitBehavior"
import { IBehavior } from "@/Domain/Behavior/IBehavior"

const TEST_DAY = 20221001 // 土曜

// DateUtilのmock化
jest.mock('@/Util/DateUtil', () => {
  // 実際のモジュールを取得
  const utils = jest.requireActual('@/Util/DateUtil')
  return {
    // モック化不要なものはそのまま
    ...utils,
    // テスト対象のみ置き換える
    dateFactory: jest.fn().mockImplementation((param?) => {
      // デフォルトの日付を固定にする
      // TODO: これをtest単位で設定
      return utils.dateFactory(param ?? TEST_DAY)
    })
  }
})

describe('main', () => {
  test('初回の実施予定の集計ができること', () => {

    const data: Habit = {
      id: '',
      rootId: '',
      title: '毎日実施するタスク',
      frequency: Frequnecy.DAILY,
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateSummary()
    })

    const today = new Date(2022, 9, 1) // 2022/10/01
    const year = today.getFullYear()
    const month = today.getMonth()

    // - 今日の実施予定日が`1`になっていること
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
      weekdays: [3, 4], // 水、木曜
      summaryUpdatedAt: 20220830
    } as Habit

    const result: Habit = new HabitBehavior(data).action((behavior: IBehavior<Habit>) => {
      const b = behavior as HabitBehavior
      b.updateSummary()
    })

    const today = new Date(2022, 8, 1) // 2022/09/01
    const year = today.getFullYear()
    const month = today.getMonth() // 8 = 9月

    // - 9月分の実施予定日が計算されていること
    const lastMonthPlan = result.plan[year as FullYear][month]
    expect(lastMonthPlan).toBe('c183060c')

    // 2022/10/1は土曜日なので対象日でない
    expect(result.isPlanDay).toBe(false)
  })
})
