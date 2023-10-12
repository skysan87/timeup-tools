import { TaskUseCase, TasklistUseCase, HabitUseCase, ConfigUseCase, AuthenticateUseCase } from '@timeup-tools/core/usecase'
import {
  InMemoryTransaction
  , InMemoryUserRepository
  , InMemoryTaskRepository
  , InMemoryTasklistRepository
  , InMemoryHabitRepository
  , InMemoryHabitlistRepository
  , InMemoryConfigRepository
} from '@timeup-tools/inmemory-infra/repository'

declare module '#app' {
  interface NuxtApp {
    $auth: AuthenticateUseCase,
    $task: TaskUseCase,
    $tasklist: TasklistUseCase,
    $habit: HabitUseCase,
    $user_config: ConfigUseCase
  }
}

export default defineNuxtPlugin(() => {

  console.log('=== install app_mode: inmemory-infra ===')

  const userRepo = new InMemoryUserRepository()
  const habitlistRepo = new InMemoryHabitlistRepository()
  const habitRepo = new InMemoryHabitRepository()
  const taskRepo = new InMemoryTaskRepository()
  const tasklistRepo = new InMemoryTasklistRepository()
  const configRepo = new InMemoryConfigRepository()
  const trunsaction = new InMemoryTransaction()

  const auth = new AuthenticateUseCase(userRepo)
  const task = new TaskUseCase(userRepo, taskRepo, tasklistRepo, habitlistRepo, habitRepo, trunsaction)
  const tasklist = new TasklistUseCase(userRepo, tasklistRepo, trunsaction)
  const habit = new HabitUseCase(userRepo, habitlistRepo, habitRepo, trunsaction)
  const config = new ConfigUseCase(userRepo, configRepo, trunsaction)

  return {
    provide: {
      auth: () => auth,
      task: () => task,
      tasklist: () => tasklist,
      habit: () => habit,
      user_config: () => config
    }
  }
})