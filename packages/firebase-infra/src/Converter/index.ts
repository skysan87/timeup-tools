import { Config, Habit, Habitlist, Task, Tasklist } from '@timeup-tools/core/model'
import { IgnoreField, Entity, TaskEntity, TasklistEntity, HabitEntity, HabitlistEntity, ConfigEntity } from '../Entity'

function ModelToEntity<T extends IgnoreField, U extends Entity<T>>(model: T): U {
  const { id, createdAt, updatedAt, ...picked } = model as T
  return {
    ...picked,
    createdAt: undefined,
    updatedAt: undefined
  } as U
}

export const toTaskEntity = (model: Task): TaskEntity => ModelToEntity(model)

export const toTasklistEntity = (model: Tasklist): TasklistEntity => ModelToEntity(model)

export const toHabitEntity = (model: Habit): HabitEntity => ModelToEntity(model)

export const toHabitlistEntity = (model: Habitlist): HabitlistEntity => ModelToEntity(model)

export const toConfigEntity = (model: Config): ConfigEntity => ModelToEntity(model)