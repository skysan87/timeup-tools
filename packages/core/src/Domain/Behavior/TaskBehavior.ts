import { Task } from "../Model/Task"
import { TaskState, TaskType } from "../ValueObject"
import { BehaviorBase } from "./BehaviorBase"
import { IBehavior } from "./IBehavior"
import { isEmpty } from "../../Util/StringUtil"
import { ValidateError } from "../../Error/ValidateError"

export class TaskBehavior extends BehaviorBase<Task> {

  public action(callback: (behavior: IBehavior<Task>) => void): Task {
    this.validate()
    this.value = this.format()
    callback(this)
    return this.value
  }

  public async actionAsync(callback: (behavior: IBehavior<Task>) => Promise<void>): Promise<Task> {
    this.validate()
    this.value = this.format()
    await callback(this)
    return this.value
  }

  private validate(): void {
    const error = new ValidateError<Task>()

    if (isEmpty(this.value.title)) {
      error.set('title', 'title is empty')
    }

    if (error.hasError) {
      throw error
    }
  }

  public format(): Task {
    const v = this.value
    return {
      id: v.id,
      title: v.title ?? null,
      type: v.type ?? TaskType.TODO,
      state: v.state ?? TaskState.Todo,
      detail: v.detail ?? null,
      startdate: v.startdate ?? null,
      enddate: v.enddate ?? null,
      orderIndex: v.orderIndex ?? 0,
      listId: v.listId ?? '',
      userId: v.userId ?? '',
      lastActivityDate: v.lastActivityDate ?? null,
      stateChangeDate: v.stateChangeDate ?? null,
      createdAt: v.createdAt ?? null,
      updatedAt: v.updatedAt ?? null,
      // Proxy対応
      subTasks: v.subTasks ? v.subTasks.map(v => ({...v})) : [],
      isDone: v.isDone ?? false
    } as Task
  }
}