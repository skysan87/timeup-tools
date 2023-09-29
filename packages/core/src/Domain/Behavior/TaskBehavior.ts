import { Task } from "../Model/Task"
import { TaskState, TaskType } from "../ValueObject"
import { BehaviorBase } from "./BehaviorBase"

export class TaskBehavior extends BehaviorBase<Task> {

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
      subTasks: v.subTasks ?? [],
      isDone: v.isDone ?? false
    } as Task
  }
}