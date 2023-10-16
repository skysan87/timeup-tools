import type { TaskUseCase, TasklistUseCase, HabitUseCase, ConfigUseCase, AuthenticateUseCase } from '@timeup-tools/core/usecase'

declare module '#app' {
  interface NuxtApp {
    $auth: AuthenticateUseCase,
    $task: TaskUseCase,
    $tasklist: TasklistUseCase,
    $habit: HabitUseCase,
    $user_config: ConfigUseCase
  }
}
