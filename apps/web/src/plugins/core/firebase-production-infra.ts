import { TaskUseCase, TasklistUseCase, HabitUseCase, ConfigUseCase, AuthenticateUseCase } from '@timeup-tools/core/usecase'
import {
  FirestoreTransaction
  , UserRepository
  , TaskRepository
  , TasklistRepository
  , HabitRepository
  , HabitlistRepository
  , ConfigRepository
} from '@timeup-tools/firebase-infra/repository'

export default defineNuxtPlugin(() => {

  console.log('=== install app_mode: firebase-production-infra ===')

  const userRepo = new UserRepository()
  const habitlistRepo = new HabitlistRepository()
  const habitRepo = new HabitRepository()
  const taskRepo = new TaskRepository()
  const tasklistRepo = new TasklistRepository()
  const configRepo = new ConfigRepository()
  const trunsaction = new FirestoreTransaction()

  const auth = new AuthenticateUseCase(userRepo)
  const task = new TaskUseCase(userRepo, taskRepo, tasklistRepo, habitlistRepo, habitRepo, trunsaction)
  const tasklist = new TasklistUseCase(userRepo, tasklistRepo, taskRepo, trunsaction)
  const habit = new HabitUseCase(userRepo, habitlistRepo, habitRepo, trunsaction)
  const config = new ConfigUseCase(userRepo, configRepo, trunsaction)

  return {
    provide: {
      auth: auth,
      task: task,
      tasklist: tasklist,
      habit: habit,
      user_config: config
    }
  }
})