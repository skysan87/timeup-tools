import { Habitlist } from "../Model/Habitlist"
import { BehaviorBase } from "./BehaviorBase"

export class HabitlistBehavior extends BehaviorBase<Habitlist> {

  public format(): Habitlist {
    const v = this.value
    return {
      id: v.id, // TODO: userId
      userId: v.userId ?? '',
      maxIndex: v.maxIndex ?? 0,
      createdAt: v.createdAt ?? null,
      updatedAt: v.updatedAt ?? null
    } as Habitlist
  }
}