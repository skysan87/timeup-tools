import { SubTask } from "../Model/SubTask"
import { BehaviorBase } from "./BehaviorBase"

export class SubTaskBehavior extends BehaviorBase<SubTask> {

  public format(): SubTask {
    const v = this.value
    return {
      id: v.id,
      title: v.title ?? '',
      isDone: v.isDone ?? false
    } as SubTask
  }
}