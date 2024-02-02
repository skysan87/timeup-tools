import { dateFactory, DateUtil } from "@timeup-tools/core/util/DateUtil"
import type { Task } from "@timeup-tools/core/model"
import { DateNumber } from "@timeup-tools/core/value-object"

export class GanttViewModel {
  id: string
  name: string
  startDate: DateUtil | null
  endDate: DateUtil | null
  #srcStartDate: DateNumber | null
  #srcEndDate: DateNumber | null

  constructor(task: Task) {
    this.id = task.id
    this.name = task.title
    this.startDate = task.startdate ? dateFactory(task.startdate) : null
    this.endDate = task.enddate ? dateFactory(task.enddate) : null
    this.#srcStartDate = task.startdate ?? null
    this.#srcEndDate = task.enddate ?? null
  }

  get isChanged() {
    const newStartDateNum = this.startDate?.getDateNumber() ?? null
    const newEndDateNum = this.endDate?.getDateNumber() ?? null
    return newStartDateNum !== this.#srcStartDate ||
      newEndDateNum !== this.#srcEndDate
  }

  get undecided() {
    return !this.startDate || !this.endDate
  }

  get startDateString() {
    return this.startDate?.format('YYYY/MM/DD') ?? ''
  }

  get endDateString() {
    return this.endDate?.format('YYYY/MM/DD') ?? ''
  }

  calcDiff(rangeStart: DateUtil, rangeEnd: DateUtil): { between: number, start: number, outOfRange: boolean } {
    if (this.undecided) {
      return {
        between: 0,
        start: 0,
        outOfRange: true
      }
    }
    const between = this.endDate!.diff(this.startDate!, 'day') + 1
    const start = this.startDate!.diff(rangeStart, 'day')
    const end = rangeEnd.diff(this.endDate!, 'day')
    return {
      between,
      start,
      outOfRange: !(start >= 0 && end >= 0)
    }
  }
}