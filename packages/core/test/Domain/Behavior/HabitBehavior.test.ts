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
    dateFactory: jest.fn().mockImplementation((param) => {
      // デフォルトの日付を固定にする
      // TODO: これをtest単位で設定
      return utils.dateFactory(TEST_DAY)
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
})
