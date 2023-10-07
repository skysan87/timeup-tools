import { dateFactory, forDayEach, forDayReverseEach } from "../../Util/DateUtil"
import { Task } from "../Model"
import { Habit } from "../Model/Habit"
import { Array12, Array32, DateNumber, Flag, Frequnecy, FullYear, HexNumber, MonthlyType, TaskState, TaskType, UnzippedData, Weekdays, ZippedData } from "../ValueObject"
import { BehaviorBase } from "./BehaviorBase"
import { IBehavior } from "./IBehavior"

export class HabitBehavior extends BehaviorBase<Habit> {

  private today = dateFactory().toDate()

  public action(callback: (behavior: IBehavior<Habit>) => void): Habit {
    this.value = this.format()
    callback(this)
    this.checkPlanDay()
    return this.value
  }

  public async actionAsync(callback: (behavior: IBehavior<Habit>) => Promise<void>): Promise<Habit> {
    this.value = this.format()
    await callback(this)
    this.checkPlanDay()
    return this.value
  }

  public format(): Habit {
    const v = this.value
    return {
      id: v.id,
      rootId: v.rootId,
      title: v.title ?? null,
      detail: v.detail ?? null,
      isActive: v.isActive ?? true,
      frequency: v.frequency ?? Frequnecy.DAILY,
      weekdays: v.weekdays ?? [],
      monthlyType: v.monthlyType ?? null,
      planDays: v.planDays ?? [],
      planWeek: v.planWeek ?? null,
      orderIndex: v.orderIndex ?? 0,
      userId: v.userId ?? null,
      lastActivityDate: v.lastActivityDate ?? null,
      totalCount: v.totalCount ?? 0,
      totalActivityCount: v.totalActivityCount ?? 0,
      duration: v.duration ?? 0,
      maxduration: v.maxduration ?? 0,
      summaryUpdatedAt: v.summaryUpdatedAt ?? null,
      plan: v.plan ?? this.initializeZippedData(),
      result: v.result ?? this.initializeZippedData(),
      createdAt: v.createdAt ?? null,
      updatedAt: v.updatedAt ?? null,
      needServerUpdate: v.needServerUpdate ?? false,
      isPlanDay: v.isPlanDay ?? false
    } as Habit
  }

  private initializeZippedData(): ZippedData {
    const key: FullYear = this.today.getFullYear() as FullYear
    const value: Array12<HexNumber> = this.getYearHexArray()
    return { [key]: value }
  }

  private getYearHexArray(): Array12<HexNumber> {
    return Array.from({ length: 12 }, () => '0') as Array12<HexNumber>
  }

  /**
   * 今日が実施日か判定
   */
  private checkPlanDay() {
    const today = dateFactory().toDate()
    const _y = today.getFullYear() as FullYear
    const _m = today.getMonth()
    const _d = today.getDate()
    try {
      const thisMonthPlan = this.unzip(this.value.plan[_y][_m])
      this.value.isPlanDay = thisMonthPlan[_d] === Flag.ON
    } catch {
      this.value.isPlanDay = false
    }
  }

  /**
   * 計算した実績の取得: サーバ更新用
   */
  public getSummary() {
    return {
      totalCount: this.value.totalCount,
      duration: this.value.duration,
      maxduration: this.value.maxduration,
      summaryUpdatedAt: this.value.summaryUpdatedAt,
      plan: this.value.plan
    }
  }

  /**
   * 実績の更新
   */
  public updateSummary(): void {
    if (!this.value.isActive) {
      return
    }

    const dateNumber = dateFactory().getDateNumber() as DateNumber

    if (this.value.summaryUpdatedAt === null || this.value.summaryUpdatedAt < dateNumber) {
      this.calcSummary()
      this.value.summaryUpdatedAt = dateNumber
      this.value.needServerUpdate = true
    } else {
      this.value.needServerUpdate = false
    }
  }

  /**
   * 実施予定情報を計算
   * @description
   * - 実施予定日、通算対象回数、継続数を算出する
   */
  private calcSummary(): void {
    // 初期化
    const today = dateFactory().toDate()
    const years: FullYear[] = Object.keys(this.value.plan).sort().map(str => parseInt(str) as FullYear)
    const firstYear: FullYear = years.length > 0 ? years[0] : today.getFullYear() as FullYear
    const isFirstTime = this.value.summaryUpdatedAt === null

    let unzipPlan: UnzippedData = {}

    // 非圧縮
    for (let y = firstYear; y <= today.getFullYear(); y++) {
      // 年を跨いだ時
      if (!this.value.plan[y]) {
        this.value.plan[y] = this.getYearHexArray()
      }
      unzipPlan[y] = this.value.plan[y].map((monthPlan) => {
        return this.unzip(monthPlan)
      }) as Array12<Array32<Flag>>
    }

    // 実施予定日を計算
    if (!isFirstTime) {
      const lastUpdate = dateFactory(this.value.summaryUpdatedAt!.toString()).addDay(1).toDate()
      // 最終更新日の翌日から今日まで
      forDayEach(lastUpdate, today, (targetDate: Date) => {
        if (this.calcPlanFlag(unzipPlan, targetDate)) {
          this.value.totalCount++ // 通算対象回数
        }
        return false
      })
    } else {
      if (this.calcPlanFlag(unzipPlan, today)) {
        this.value.totalCount++ // 通算対象回数
      }
    }

    // 前回実施予定日
    let lastPlanDate: DateNumber | null = null

    if (!isFirstTime) {
      const firstday = new Date(firstYear, 0, 1)
      forDayReverseEach(firstday, today, (targetDate: Date) => {
        const _y = targetDate.getFullYear() as FullYear
        const _m = targetDate.getMonth()
        const _d = targetDate.getDate()
        if (unzipPlan[_y][_m][_d] === Flag.ON) {
          lastPlanDate = parseInt(`${_y}${_m}${_d}`) as DateNumber
          return true // 終了
        }
        return false
      })
    }

    // 圧縮
    // 実施予定日: 実績更新日から本日までの期間の実施予定日を更新
    for (let y = firstYear; y <= today.getFullYear(); y++) {
      unzipPlan[y].forEach((monthPlan, index) => {
        this.value.plan[y][index] = this.zip(monthPlan)
      })
    }

    // 最大継続数
    if (this.value.maxduration < this.value.duration) {
      this.value.maxduration = this.value.duration
    }

    // 継続数をリセット
    if (lastPlanDate !== null
      && this.value.lastActivityDate !== null
      && lastPlanDate! > this.value.lastActivityDate) {
      this.value.duration = 0
    }
  }

  /**
   * 習慣タスク(TaskType.Habit)の実績計算
   */
  public calcSummaryFromTask(oldTask: Task, newTask: Task): void {
    if (oldTask.state === newTask.state) {
      return
    }

    let counter: number = 0
    let lastActivityDate = oldTask.lastActivityDate

    if (newTask.state === TaskState.Done) {
      counter = 1
      lastActivityDate = dateFactory().getDateNumber() as DateNumber
    } else if (oldTask.state === TaskState.Done) {
      // Doneから変更された場合はリセット
      counter = -1
      lastActivityDate = newTask.lastActivityDate
    }

    this.updateResult(newTask.state === TaskState.Done)

    this.value.totalActivityCount += counter
    this.value.duration += counter
    this.value.lastActivityDate = lastActivityDate
  }

  /**
   * 繰り返し設定から実行予定日を判定
   * @param unzipPlan 解凍すみの実行予定データ
   * @param _date 対象日
   * @returns 実行予定日であればtrue
   */
  private calcPlanFlag(unzipPlan: UnzippedData, _date: Date): boolean {
    const _y = _date.getFullYear() as FullYear
    const _m = _date.getMonth()
    const _d = _date.getDate()
    const _dw = _date.getDay().toString() as Weekdays

    if (this.value.frequency === Frequnecy.DAILY) {
      unzipPlan[_y][_m][_d] = Flag.ON
      return true
    } else if (this.value.frequency === Frequnecy.WEEKLY) {
      // 実施日ならフラグを立てる
      if (this.value.weekdays.includes(_dw)) {
        unzipPlan[_y][_m][_d] = Flag.ON
        return true
      }
    } else if (this.value.frequency === Frequnecy.MONTHLY) {
      return this.calcMonthyPlanFlag(unzipPlan, _date)
    }
    return false
  }

  /**
   * 繰り返し設定が月単位の場合の実行予定日を判定
   * @param unzipPlan 解凍済の実行予定データ
   * @param _date 対象日
   * @returns 実行予定日であればtrue
   */
  private calcMonthyPlanFlag(unzipPlan: UnzippedData, _date: Date): boolean {
    const _y = _date.getFullYear() as FullYear
    const _m = _date.getMonth()
    const _d = _date.getDate()

    switch (this.value.monthlyType) {
      case MonthlyType.DAY:
        if (this.value.planDays.includes(_d)) {
          unzipPlan[_y][_m][_d] = Flag.ON
          return true
        }
        break
      case MonthlyType.WEEK:
        if (!this.value.planWeek) {
          return false
        }
        // 第何周の何曜日か
        if (dateFactory(_date).getWeekIndex() === this.value.planWeek.index &&
          _date.getDay() === this.value.planWeek.day) {
          unzipPlan[_y][_m][_d] = Flag.ON
          return true
        }
        break
      case MonthlyType.END:
        // 月末判定
        if (dateFactory(_date).daysInMonth() === _d) {
          unzipPlan[_y][_m][_d] = Flag.ON
          return true
        }
        break
      default:
        return false
    }
    return false
  }

  /**
   * 実績の更新
   * @description タスクが完了したら、実績にフラグを立てる
   * @param isDone タスクが完了したか
   */
  private updateResult(isDone: boolean) {
    const today = dateFactory().toDate()
    const year = today.getFullYear() as FullYear
    const month = today.getMonth()
    const day = today.getDate()
    // 年を跨いだ時
    if (!this.value.result[year]) {
      this.value.result[year] = this.getYearHexArray()
    }
    const unzipResult = this.unzip(this.value.result[year][month])

    unzipResult[day] = isDone ? Flag.ON : Flag.OFF
    this.value.result[year][month] = this.zip(unzipResult)
  }

  /**
   * 解凍(16進数->2進数)
   * @description
   *  月単位のデータをフラグ(2進数)で管理している。
   *  永続化する場合、圧縮して16進数に変換している。
   *  一月は32bitに収まるので、16進数では0〜FFFFFFFFで表される
   * @param monthlyHexData 圧縮データ(16進数)
   * @returns 解凍データ(32個の2進数)
   */
  private unzip(monthlyHexData: HexNumber): Array32<Flag> {
    if (monthlyHexData !== '0') {
      // 16進数 -> 2進数の配列
      return parseInt(monthlyHexData, 16).toString(2).split('') as Array32<Flag>
    } else {
      const arr = Array.from({ length: 32 }, () => Flag.OFF) as Array32<Flag>
      arr[0] = Flag.ON // 32桁を維持するため、先頭は埋める
      return arr
    }
  }

  /**
   * 圧縮(2進数->16進数)
   * @description
   *  月単位のデータをフラグ(2進数)で管理している。
   *  永続化する場合、圧縮して16進数に変換している。
   *  一月は32bitに収まるので、16進数では0〜FFFFFFFFで表される
   * @param monthlyBitData 解凍データ(32個の2進数)
   * @returns 圧縮データ(16進数)
   */
  private zip(monthlyBitData: Array32<Flag>): HexNumber {
    return parseInt(monthlyBitData.join(''), 2).toString(16) as HexNumber
  }

  /**
   * 対象月の実施予定日を取得
   * @param year 年(西暦)
   * @param month 月(0-11)
   * @return 日付(YYYY-MM-DD)の配列
   */
  public getPlanDaysOfMonth(year: FullYear, month: number): string[] {
    return this.getTargetMonth(this.value.plan, year, month)
  }

  /**
   * 対象月の実績日を取得
   * @param year 年(西暦)
   * @param month 月(0-11)
   * @return 日付(YYYY-MM-DD)の配列
   */
  public getResultDaysOfMonth(year: FullYear, month: number): string[] {
    return this.getTargetMonth(this.value.result, year, month)
  }

  /**
   * 実施予定/実績から対象月の予定を取得
   * @param zipedArray plan/result
   * @param year 年(西暦)
   * @param month 月(0-11)
   * @return 日付(YYYY-MM-DD)の配列
   */
  private getTargetMonth(zipedArray: ZippedData, year: FullYear, month: number): string[] {
    if (!zipedArray[year]) {
      return []
    }

    const lastDay = new Date(year, month + 1, 0).getDate()
    const unzipedDays = this.unzip(zipedArray[year][month])
    const targetDays: string[] = []
    const actualMonth = month + 1

    for (let i = 1; i <= lastDay; i++) {
      if (unzipedDays[i] === Flag.ON) {
        targetDays.push(`${year}-${actualMonth}-${i}`)
      }
    }
    return targetDays
  }
}