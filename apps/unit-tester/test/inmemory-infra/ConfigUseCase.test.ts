import { Config } from '@timeup-tools/core/model'
import { ConfigUseCase } from '@timeup-tools/core/usecase'
import {
  DummyUserRepository,
  InMemoryTransaction,
  ConfigRepository
} from '@timeup-tools/web-storage-infra/repository'

let usecase: ConfigUseCase

const userRepositpry = new DummyUserRepository(true)

beforeEach(async () => {
  InMemoryTransaction.reset()
  await userRepositpry.login()
  const configRepo = new ConfigRepository()
  const trunsaction = new InMemoryTransaction()
  usecase = new ConfigUseCase(userRepositpry, configRepo, trunsaction)
})

describe('ConfigUseCase #create', () => {
  test('データ生成', () => {
    const config: Config = usecase.create()

    expect(config).toStrictEqual({
      id: undefined,
      userId: undefined,
      globalMessage: '',
      createdAt: null,
      updatedAt: null
    })
  })
})

describe('ConfigUseCase #getConfig', () => {
  test('初回データ取得', async () => {
    const config = await usecase.getConfig()

    expect(!config.id).toBe(false)
    expect(config.userId).toBe(userRepositpry.getFromCache().id)
    expect(!config.createdAt).toBe(false)
    expect(!config.updatedAt).toBe(false)
    expect(config.createdAt === config.updatedAt).toBe(true)
  })
})

describe('ConfigUseCase #updateMessage', () => {
  test('メッセージ更新', async () => {
    const message = 'hello'
    await usecase.getConfig() // 初回データ作成
    await usecase.updateMessage(message)
    const config = await usecase.getConfig()

    expect(config.globalMessage).toBe(message)
    expect(!config.createdAt).toBe(false)
    expect(!config.updatedAt).toBe(false)
    expect(config.createdAt === config.updatedAt).toBe(false)
  })
})