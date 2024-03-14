import { Config, Habit, Habitlist, Task, Tasklist } from '@timeup-tools/core/model'
import { TaskEntity, TasklistEntity, HabitEntity, HabitlistEntity, ConfigEntity } from '../Entity'

export function toTaskEntity(model: Task): TaskEntity {
  return {
    detail: model.detail,
    enddate: model.enddate,
    lastActivityDate: model.lastActivityDate,
    listId: model.listId,
    orderIndex: model.orderIndex,
    startdate: model.startdate,
    state: model.state,
    stateChangeDate: model.stateChangeDate,
    subTasks: structuredClone(model.subTasks),
    title: model.title,
    type: model.type,
    userId: model.userId,
    createdAt: undefined,
    updatedAt: undefined
  }
}

export function toTasklistEntity(model: Tasklist): TasklistEntity {
  return {
    detail: model.detail,
    maxIndex: model.maxIndex,
    orderIndex: model.orderIndex,
    title: model.title,
    userId: model.userId,
    createdAt: undefined,
    updatedAt: undefined
  }
}

export function toHabitEntity(model: Habit): HabitEntity {
  return {
    detail: model.detail,
    duration: model.duration,
    frequency: model.frequency,
    isActive: model.isActive,
    lastActivityDate: model.lastActivityDate,
    maxduration: model.maxduration,
    monthlyType: model.monthlyType,
    orderIndex: model.orderIndex,
    plan: structuredClone(model.plan),
    planDays: structuredClone(model.planDays),
    planWeek: structuredClone(model.planWeek),
    title: model.title,
    result: structuredClone(model.result),
    rootId: model.rootId,
    summaryUpdatedAt: model.summaryUpdatedAt,
    totalActivityCount: model.totalActivityCount,
    totalCount: model.totalCount,
    weekdays: structuredClone(model.weekdays),
    userId: model.userId,
    createdAt: undefined,
    updatedAt: undefined
  }
}

export function toHabitlistEntity(model: Habitlist): HabitlistEntity {
  return {
    maxIndex: model.maxIndex,
    userId: model.userId,
    createdAt: undefined,
    updatedAt: undefined
  }
}

export function toConfigEntity(model: Config): ConfigEntity {
  return {
    globalMessage: model.globalMessage,
    userId: model.userId,
    createdAt: undefined,
    updatedAt: undefined
  }
}