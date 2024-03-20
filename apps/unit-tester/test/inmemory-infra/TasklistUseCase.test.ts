import { ValidateError } from '@timeup-tools/core/error'
import { TasklistUseCase } from '@timeup-tools/core/usecase'
import {
  TaskRepository,
  TasklistRepository,
  DummyUserRepository,
  InMemoryTransaction
} from '@timeup-tools/web-storage-infra/repository'

let usecase: TasklistUseCase

const userRepositpry = new DummyUserRepository(true)

beforeEach(async () => {
  InMemoryTransaction.reset()
  await userRepositpry.login()
  const taskRepo = new TaskRepository()
  const tasklistRepo = new TasklistRepository()
  const trunsaction = new InMemoryTransaction()
  usecase = new TasklistUseCase(userRepositpry, tasklistRepo, taskRepo, trunsaction)
})

describe('TasklistUseCase #create', () => {
  test('データ生成', () => {
    // TasklistBehavior#formatと同様のため詳細確認はSkip
    const tasklist = usecase.create()
    expect(!tasklist).toBe(false)
  })
})

describe('TasklistUseCase #getList', () => {
  test('初回は1件取得できる', async () => {
    const tasklists = await usecase.getList()
    expect(tasklists.length).toBe(1)
  })

  test('登録→再ログインで2件取得できる', async () => {
    await usecase.getList()

    const tasklist = usecase.create()
    tasklist.title = 'new_list'
    await usecase.addList(tasklist)

    await userRepositpry.logout()

    // 再ログイン
    await userRepositpry.login()

    const tasklists = await usecase.getList()
    expect(tasklists.length).toBe(2)
  })
})

describe('TasklistUseCase #addList', () => {
  const MAX_NUM = 10

  test('データ登録', async () => {
    const lists = await usecase.getList()
    const lastMaxIndex = lists
      .map(i => i.maxIndex)
      .reduce((a, b) => Math.max(a, b), 0)

    const tasklist = usecase.create()
    tasklist.title = 'new_list'
    const created = await usecase.addList(tasklist)

    expect(!created.id).toBe(false)
    expect(created.userId).toBe(userRepositpry.getFromCache().id)
    expect(!created.createdAt).toBe(false)
    expect(!created.updatedAt).toBe(false)
    expect(created.createdAt === created.updatedAt).toBe(true)
    expect(created.orderIndex).toBe(lastMaxIndex + 1)
    expect(created.maxIndex).toBe(lastMaxIndex + 1)
  })

  test('バリデーションエラー', async () => {
    await usecase.getList()

    async function validateTest() {
      const tasklist = usecase.create()
      tasklist.title = ''
      await usecase.addList(tasklist)
    }

    await expect(validateTest).rejects.toThrowError(ValidateError)
  })

  test('登録上限まで登録できる', async () => {
    for (const num in Array.from({ length: MAX_NUM }, (_, n) => n)) {
      const tasklist = usecase.create()
      tasklist.title = `title_${num}`
      await usecase.addList(tasklist)
    }

    const tasklists = await usecase.getList()
    expect(tasklists.length).toBe(MAX_NUM)
  })

  test('登録上限オーバーでエラー発生', async () => {
    await usecase.getList()

    async function maxCountTest() {
      for (const num in Array.from({ length: MAX_NUM + 1 }, (_, n) => n)) {
        const tasklist = usecase.create()
        tasklist.title = `title_${num}`
        await usecase.addList(tasklist)
      }
    }

    await expect(maxCountTest()).rejects.toThrow(new Error('これ以上登録できません'))
  })

  test('登録上限オーバーしても上限までは登録されている', async () => {
    await usecase.getList()

    try {
      for (const num in Array.from({ length: MAX_NUM + 1 }, (_, n) => n)) {
        const tasklist = usecase.create()
        tasklist.title = `title_${num}`
        await usecase.addList(tasklist)
      }
    } catch {
      // エラーチェックしない
    }

    const tasklists = await usecase.getList()
    expect(tasklists.length).toBe(MAX_NUM)
  })
})

describe('TasklistUseCase #updateList', () => {
  test('データ更新', async () => {
    const lists = await usecase.getList()
    const tasklist = lists[0]
    tasklist.title = 'updated'
    const updated = await usecase.updateList(tasklist)

    expect(updated.updatedAt !== updated.createdAt).toBe(true)

    const updatedlists = await usecase.getList()
    expect(updatedlists.length).toBe(1)
  })

  test('バリデーションエラー', async () => {
    async function validateTest() {
      const lists = await usecase.getList()
      const tasklist = lists[0]
      tasklist.title = ''
      await usecase.updateList(tasklist)
    }

    await expect(validateTest).rejects.toThrowError(ValidateError)
  })

  test('存在しないデータ更新でエラー', async () => {
    async function nonExistUpdateTest() {
      const lists = await usecase.getList()
      const tasklist = lists[0]
      tasklist.id = 'unknown_id' // 存在しないID
      tasklist.title = 'title'
      await usecase.updateList(tasklist)
    }
    await expect(nonExistUpdateTest).rejects.toThrowError(Error)
  })
})

describe('TasklistUseCase #deleteList', () => {
  test('既存データ削除', async () => {
    const lists = await usecase.getList()
    await usecase.deleteList(lists[0].id)
  })

  test('新規登録後データ削除', async () => {
    await usecase.getList()

    const newlist = usecase.create()
    newlist.title = 'new_list'
    const updated = await usecase.addList(newlist)

    await usecase.deleteList(updated.id)

    const lists = await usecase.getList()
    expect(lists.length).toBe(1)
  })

  test('存在しないデータ削除', async () => {
    await usecase.getList()
    await usecase.deleteList('unknown_id')

    const lists = await usecase.getList()
    expect(lists.length).toBe(1)
  })
})