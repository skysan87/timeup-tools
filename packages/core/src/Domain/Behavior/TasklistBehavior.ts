import { Tasklist } from "../Model/Tasklist"
import { BehaviorBase } from "./BehaviorBase"

export class TasklistBehavior extends BehaviorBase<Tasklist> {

  public format(): Tasklist {
    const v = this.value
    return {
      id: v.id, // TODO: userId
      title: v.title ?? '',
      detail: v.detail ?? '',
      userId: v.userId ?? '',
      maxIndex: v.maxIndex ?? 0,
      orderIndex: v.orderIndex ?? 0,
      createdAt: v.createdAt ?? null,
      updatedAt: v.updatedAt ?? null
    } as Tasklist
  }
}