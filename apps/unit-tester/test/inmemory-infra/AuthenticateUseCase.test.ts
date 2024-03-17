import { AuthenticateUseCase } from '@timeup-tools/core/usecase'
import {
  DummyUserRepository
} from '@timeup-tools/web-storage-infra/repository'

let usecase: AuthenticateUseCase

const userRepositpry = new DummyUserRepository(true)

beforeEach(async () => {
  usecase = new AuthenticateUseCase(userRepositpry)
  usecase.initalize()
})

describe('AuthenticateUseCase #login', () => {
  test('ログインして、ユーザ情報取得', async () => {
    const user = await usecase.login()
    expect(!user).toBe(false)
    expect(usecase.authenticated()).toBe(true)
  })
})

describe('AuthenticateUseCase #logout', () => {
  test('ログアウトして、ユーザ情報取得', async () => {
    await usecase.login()
    await usecase.logout()

    expect(usecase.authenticated()).toBe(false)
  })
})

describe('AuthenticateUseCase #getUser', () => {
  test('ログインして、ユーザ情報取得', async () => {
    const user = await usecase.login()
    expect(!user).toBe(false)
    expect(usecase.authenticated()).toBe(true)
  })

  test('ログアウトして、ユーザ情報取得', async () => {
    await usecase.login()
    await usecase.logout()

    expect(usecase.authenticated()).toBe(false)
  })
})

describe('AuthenticateUseCase #getUser', () => {
  test('ログインして、ユーザ情報取得', async () => {
    await usecase.login()
    const user = await usecase.getUser()
    expect(!user).toBe(false)
  })

  test('ログアウトして、ユーザ情報取得', async () => {
    await usecase.login()
    await usecase.logout()

    async function authTest() {
      await usecase.getUser()
    }

    await expect(authTest).rejects.toThrowError(Error)
  })
})
