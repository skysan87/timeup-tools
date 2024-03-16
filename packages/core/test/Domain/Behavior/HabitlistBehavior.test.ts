import { UserId } from "@/Domain/ValueObject"
import { Habitlist } from "@/Domain/Model"
import { HabitlistBehavior } from "@/Domain/Behavior/HabitlistBehavior"

describe('HabitlistBehavior #format', () => {
  test('正常処理', () => {
    const data = {
      id: '',
      userId: '' as UserId,
      maxIndex: 0,
      createdAt: null,
      updatedAt: null
    } as Habitlist

    const formatted = new HabitlistBehavior(data).format()

    expect(data).toStrictEqual(formatted)
  })
})