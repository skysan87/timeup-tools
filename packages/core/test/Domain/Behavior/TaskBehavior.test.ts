import { SubTask, Task } from "@/Domain/Model"
import { TaskBehavior } from "@/Domain/Behavior/TaskBehavior"
import { TaskState, TaskType } from "@/Domain/ValueObject"
import { ValidateError } from "@/Error"

function create(): Task {
  return {
    id: '',
    title: null,
    type: TaskType.TODO,
    state: TaskState.Todo,
    detail: null,
    startdate: null,
    enddate: null,
    orderIndex: 0,
    listId: '',
    userId: '',
    lastActivityDate: null,
    stateChangeDate: null,
    createdAt: null,
    updatedAt: null,
    subTasks: [] as SubTask[]
  } as Task
}

describe('TaskBehavior #format', () => {
  test('正常処理', () => {
    const data = create()
    const formatted = new TaskBehavior(data).format()
    expect(data).toStrictEqual(formatted)
  })
})

describe('TaskBehavior #action', () => {
  test('正常処理', () => {
    const data = create()
    data.title = 'title'
    const result = new TaskBehavior(data).action(() => { })
    expect(data).toStrictEqual(result)
  })

  test('バリデーションエラー', () => {
    function validateTest() {
      const data = create()
      new TaskBehavior(data).action(() => { })
    }
    expect(validateTest).toThrowError(ValidateError)
  })
})

describe('TaskBehavior #actionAsync', () => {
  test('正常処理', async () => {
    const data = create()
    data.title = 'title'
    const result = await new TaskBehavior(data).actionAsync(async () => { })
    expect(data).toStrictEqual(result)
  })

  test('バリデーションエラー', async () => {
    async function validateTest() {
      const data = create()
      await new TaskBehavior(data).actionAsync(async () => { })
    }
    await expect(validateTest()).rejects.toThrowError(ValidateError)
  })
})