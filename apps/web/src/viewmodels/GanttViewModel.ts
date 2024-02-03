import { dateFactory, DateUtil } from "@timeup-tools/core/util/DateUtil"
import type { Task } from "@timeup-tools/core/model"
import { DateNumber } from "@timeup-tools/core/value-object"

export class GanttViewModel {
  public id: string
  public name: string
  public startDate: DateUtil | null
  public endDate: DateUtil | null
  public pos: {
    x: number
    width: number
  }
  public style: {
    width: string
    transform: string
    display: string
  }
  public isChanged: boolean = false
  public undecided: boolean = false
  public startDateString: string = ''
  public endDateString: string = ''

  private srcStartDate: DateNumber | null
  private srcEndDate: DateNumber | null

  constructor(task: Task) {
    this.id = task.id
    this.name = task.title
    this.startDate = task.startdate ? dateFactory(task.startdate) : null
    this.endDate = task.enddate ? dateFactory(task.enddate) : null
    this.srcStartDate = task.startdate ?? null
    this.srcEndDate = task.enddate ?? null
    this.pos = {
      x: 0,
      width: 0
    }
    this.style = {
      width: `${this.pos.width}px`,
      transform: `translateX(${this.pos.x}px)`,
      display: 'block'
    }
  }

  public draw(blockSize: number, rangeStart: DateUtil, rangeEnd: DateUtil): void {
    this.startDateString = this.startDate?.format('YYYY/MM/DD') ?? ''
    this.endDateString = this.endDate?.format('YYYY/MM/DD') ?? ''
    this.undecided = !this.startDate || !this.endDate

    const newStartDateNum = this.startDate?.getDateNumber() ?? null
    const newEndDateNum = this.endDate?.getDateNumber() ?? null
    this.isChanged = newStartDateNum !== this.srcStartDate || newEndDateNum !== this.srcEndDate

    const diff = this.calcDiff(rangeStart, rangeEnd)

    this.pos = {
      x: diff.start * blockSize,
      width: blockSize * diff.between
    }

    this.style = {
      width: `${this.pos.width}px`,
      transform: `translateX(${this.pos.x}px)`,
      display: 'flex'
    }

    // 表示範囲外の日付を含む場合は表示しない
    if (diff.outOfRange) {
      this.style.display = 'none'
    }
  }

  private calcDiff(rangeStart: DateUtil, rangeEnd: DateUtil): { between: number, start: number, outOfRange: boolean } {
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