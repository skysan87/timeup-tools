import { Tasklist } from "../../../src/Domain//Model"
import { TasklistBehavior } from "../../../src/Domain/Behavior/TasklistBehavior"
import { ValidateError } from "../../../src/Error"

function create(): Tasklist {
  return {
    id: '',
    title: null,
    detail: null,
    userId: '',
    maxIndex: 0,
    orderIndex: 0,
    createdAt: null,
    updatedAt: null
  } as Tasklist
}

describe('TasklistBehavior #format', () => {
  test('正常処理', () => {
    const data = create()
    const formatted = new TasklistBehavior(data).format()
    expect(data).toStrictEqual(formatted)
  })
})

describe('TasklistBehavior #action', () => {
  test('正常処理', () => {
    const data = create()
    data.title = 'title'
    const result = new TasklistBehavior(data).action(() => { })
    expect(data).toStrictEqual(result)
  })

  test('バリデーションエラー', () => {
    function validateTest() {
      const data = create()
      new TasklistBehavior(data).action(() => { })
    }
    expect(validateTest).toThrowError(ValidateError)
  })
})

describe('TasklistBehavior #actionAsync', () => {
  test('正常処理', async () => {
    const data = create()
    data.title = 'title'
    const result = await new TasklistBehavior(data).actionAsync(async () => { })
    expect(data).toStrictEqual(result)
  })

  test('バリデーションエラー', () => {
    async function validateTest() {
      const data = create()
      await new TasklistBehavior(data).actionAsync(async () => { })
    }
    expect(validateTest).rejects.toThrowError(ValidateError)
  })
})