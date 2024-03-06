import { ValidateError } from "../../Error"
import { isEmpty } from "../../Util/StringUtil"
import { Tasklist } from "../Model/Tasklist"
import { BehaviorBase } from "./BehaviorBase"
import { IBehavior } from "./IBehavior"

export class TasklistBehavior extends BehaviorBase<Tasklist> {

  public action(callback: (behavior: IBehavior<Tasklist>) => void): Tasklist {
    this.validate()
    this.value = this.format()
    callback(this)
    return this.value
  }

  public async actionAsync(callback: (behavior: IBehavior<Tasklist>) => Promise<void>): Promise<Tasklist> {
    this.validate()
    this.value = this.format()
    await callback(this)
    return this.value
  }

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

  private validate(): void {
    const error = new ValidateError<Tasklist>()

    if (isEmpty(this.value.title)) {
      error.set('title', 'title is empty')
    }

    if (error.hasError) {
      throw error
    }
  }
}