import { UserId } from "../../../src/Domain/ValueObject"
import { Config } from "../../../src/Domain/Model"
import { ConfigBehavior } from "../../../src/Domain/Behavior/ConfigBehavior"

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