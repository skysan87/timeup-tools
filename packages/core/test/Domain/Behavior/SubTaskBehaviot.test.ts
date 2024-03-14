import { SubTask } from "../../../src/Domain/Model"
import { SubTaskBehavior } from "../../../src/Domain/Behavior/SubTaskBehavior"

describe('SubTaskBehavior #format', () => {
  test('正常処理', () => {
    const data = {
      id: '',
      title: '',
      isDone: false
    } as SubTask

    const formatted = new SubTaskBehavior(data).format()

    expect(data).toStrictEqual(formatted)
  })
})