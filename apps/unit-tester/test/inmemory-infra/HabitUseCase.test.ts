import { ValidateError } from '@timeup-tools/core/error'
import { HabitUseCase } from '@timeup-tools/core/usecase'
import {
  HabitRepository,
  HabitlistRepository,
  DummyUserRepository,
  InMemoryTransaction
} from '@timeup-tools/web-storage-infra/repository'

let usecase: HabitUseCase

const userRepositpry = new DummyUserRepository(true)

beforeEach(async () => {
  InMemoryTransaction.reset()
  await userRepositpry.login()
  const habitlistRepo = new HabitlistRepository()
  const habitRepo = new HabitRepository()
  const trunsaction = new InMemoryTransaction()

  usecase = new HabitUseCase(
    userRepositpry,
    habitlistRepo,
    habitRepo,
    trunsaction
  )
})

describe('HabitUseCase #create', () => {
  test('データ生成', () => {
    // HabitBehavior#formatと同様のため詳細確認はSkip
    const habit = usecase.create()
    expect(!habit).toBe(false)
  })
})

describe('HabitUseCase #init', () => {
  test('初回データ取得0件', async () => {
    const habits = await usecase.init()
    expect(habits.length).toBe(0)
  })

  test('再ログイン後データ取得1件', async () => {
    await usecase.init()

    const habit = usecase.create()
    habit.title = 'test'
    await usecase.addHabit(habit)

    await userRepositpry.logout()
    await userRepositpry.login()

    const habits = await usecase.init()
    expect(habits.length).toBe(1)
  })
})

describe('HabitUseCase #getFromCache', () => {
  test('キャッシュ0件', async () => {
    await usecase.init()
    const habits = await usecase.getFromCache()
    expect(habits.length).toBe(0)
  })

  test('登録したデータはキャッシュに登録されている', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    await usecase.addHabit(habit)

    const habits = await usecase.getFromCache()
    expect(habits.length).toBe(1)
  })

  test('登録したデータは際ログイン後にキャッシュに登録されている', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    await usecase.addHabit(habit)

    await userRepositpry.logout()

    // 再ログイン
    await userRepositpry.login()
    await usecase.init()

    const habits = await usecase.getFromCache()
    expect(habits.length).toBe(1)
  })
})

describe('HabitUseCase #addHabit', () => {
  const MAX_NUM = 50

  test('データ登録', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    const updated = await usecase.addHabit(habit)

    expect(!updated.id).toBe(false)
    expect(!updated.rootId).toBe(false)
    expect(updated.userId).toBe(userRepositpry.getFromCache().id)
    expect(!updated.createdAt).toBe(false)
    expect(!updated.updatedAt).toBe(false)
    expect(updated.createdAt === updated.updatedAt).toBe(true)
  })

  test('バリデーションエラー', async () => {
    async function validateTest() {
      await usecase.init()
      const habit = usecase.create()
      habit.title = ''
      await usecase.addHabit(habit)
    }
    await expect(validateTest()).rejects.toThrowError(ValidateError)
  })

  test('登録上限50件登録', async () => {
    await usecase.init()

    for (const num in Array.from({ length: MAX_NUM }, (_, n) => n)) {
      const habit = usecase.create()
      habit.title = `title_${num}`
      await usecase.addHabit(habit)
    }

    expect((await usecase.getFromCache()).length).toBe(MAX_NUM)

    const habits = await usecase.init()
    expect(habits.length).toBe(MAX_NUM)
  })

  test('登録上限超えでエラー', async() => {
    async function maxCountTest() {
      await usecase.init()
      for (const num in Array.from({ length: MAX_NUM + 1 }, (_, n) => n)) {
        const habit = usecase.create()
        habit.title = `title_${num}`
        await usecase.addHabit(habit)
      }
    }
    await expect(maxCountTest()).rejects.toThrow(new Error('これ以上登録できません'))
  })

  test('登録上限超えでも50件までは登録できる', async () => {
    try {
      await usecase.init()
      for (const num in Array.from({ length: MAX_NUM + 1 }, (_, n) => n)) {
        const habit = usecase.create()
        habit.title = `title_${num}`
        await usecase.addHabit(habit)
      }
    } catch {
      // エラーは確認しない
    }

    const habits = await usecase.init()
    expect(habits.length).toBe(MAX_NUM)
  })
})

describe('HabitUseCase #updateHabit', () => {
  test('データ更新', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    await usecase.addHabit(habit)

    const habits = await usecase.getFromCache()
    const _habit = habits[0]
    _habit.title = 'updated'
    await usecase.updateHabit(_habit)

    const updatedHabits = await usecase.getFromCache()
    expect(updatedHabits.length).toBe(1)

    const _updated = updatedHabits[0]
    expect(_updated.createdAt === _updated.updatedAt).toBe(false)
  })

  test('バリデーションエラー', async () => {
    async function validateTest() {
      await usecase.init()
      const habit = usecase.create()
      habit.title = 'test'
      await usecase.addHabit(habit)

      const habits = await usecase.getFromCache()
      const _habit = habits[0]
      _habit.title = ''
      await usecase.updateHabit(_habit)
    }

    await expect(validateTest()).rejects.toThrowError(ValidateError)
  })
})

describe('HabitUseCase #deleteHabit', () => {
  test('データ削除:キャッシュ0件', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    const updated = await usecase.addHabit(habit)

    await usecase.deleteHabit(updated.id)

    const updatedHabits = await usecase.getFromCache()
    expect(updatedHabits.length).toBe(0)
  })

  test('再ログイン後データ削除:0件', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    await usecase.addHabit(habit)

    await userRepositpry.logout()

    // 再ログイン
    await userRepositpry.login()
    const habits = await usecase.init()

    await usecase.deleteHabit(habits[0].id)

    const updatedHabits = await usecase.getFromCache()
    expect(updatedHabits.length).toBe(0)
  })

  test('データ削除:再ログイン後0件', async () => {
    await usecase.init()
    const habit = usecase.create()
    habit.title = 'test'
    const updated = await usecase.addHabit(habit)
    await usecase.deleteHabit(updated.id)

    await userRepositpry.logout()

    // 再ログイン
    await userRepositpry.login()
    const habits = await usecase.init()
    expect(habits.length).toBe(0)
  })
})