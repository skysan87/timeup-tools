import { UserId } from "@/Domain/ValueObject"
import { Config } from "@/Domain/Model"
import { ConfigBehavior } from "@/Domain/Behavior/ConfigBehavior"

describe('ConfigBehavior #format', () => {
  test('正常処理', () => {
    const data = {
      id: '',
      userId: '' as UserId,
      globalMessage: '',
      createdAt: null,
      updatedAt: null
    } as Config

    const formatted = new ConfigBehavior(data).format()

    expect(data).toStrictEqual(formatted)
  })
})