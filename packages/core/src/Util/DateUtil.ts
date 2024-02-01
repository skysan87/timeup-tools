import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ja'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.locale('ja')

/**
 * 指定した期間のループ処理(昇順)
 * @param {Date} startDate 開始日
 * @param {Date} endDate 終了日
 * @param {Function} callback コールバック(trueで中断)
 */
export function forDayEach(startDate: Date, endDate: Date, callback: (date: Date) => boolean) {
  _forDayEach(dayjs(startDate), dayjs(endDate), callback)
}

/**
 * 指定した期間のループ処理(降順)
 * @param {Date} startDate 開始日
 * @param {Date} endDate 終了日
 * @param {Function} callback コールバック(trueで中断)
 */
export function forDayReverseEach(startDate: Date, endDate: Date, callback: (date: Date) => boolean) {
  _forDayReverseEach(dayjs(startDate), dayjs(endDate), callback)
}

/**
 * 日時の差分を算出
 * @param start
 * @param end
 * @param unit 単位(day, week, month, quarter, year, hour, minute, second, millisecond)
 * @returns 過去の日付->負の数. 未来の日付->正の数
 */
export function dateDiff(start: Date, end: Date, unit: dayjs.UnitType): number {
  const startObj = dayjs(start)
  const endObj = dayjs(end)
  return endObj.diff(startObj, unit)
}

function _forDayEach(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, callback: (date: Date) => boolean) {
  for (let date = startDate; date <= endDate; date = date.add(1, 'day')) {
    const cancel = callback(date.toDate())
    if (cancel) {
      break
    }
  }
}

function _forDayReverseEach(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, callback: (date: Date) => boolean) {
  for (let date = endDate; startDate <= date; date = date.subtract(1, 'day')) {
    const cancel = callback(date.toDate())
    if (cancel) {
      break
    }
  }
}

/**
 * Factory
 */
export const dateFactory = (date?: string | number | Date, format?: string): Wrapper => Wrapper.create(date, format)

class Wrapper {

  private instance: dayjs.Dayjs

  private constructor(instance: dayjs.Dayjs) {
    this.instance = instance
  }

  static create(date?: string | number | Date, format?: string): Wrapper {
    if (!date) {
      return new Wrapper(dayjs())
    } else if (!format && (typeof date === 'string' || typeof date === 'number') && /^[0-9]{8}$/.test(date.toString())) {
      return new Wrapper(dayjs(date.toString(), 'YYYYMMDD'))
    } else if (!format && date) {
      return new Wrapper(dayjs(date))
    } else {
      return new Wrapper(dayjs(date, format))
    }
  }

  /* ==== Method Chain ==== */

  /**
   * 指定した単位で時間を進めた
   * @param {Number} value 値
   * @param {String} unit 単位(day, week, month, quarter, year, hour, minute, second, millisecond)
   * @returns {Wrapper} インスタンス
   */
  add(value: number, unit?: dayjs.UnitType): Wrapper {
    return new Wrapper(this.instance.add(value, unit as dayjs.ManipulateType))
  }

  /**
   * 指定した単位で時間を戻す
   * @param {Number} value 値
   * @param {String} unit 単位(day, week, month, quarter, year, hour, minute, second, millisecond)
   * @returns {Wrapper} インスタンス
   */
  subtract(value: number, unit?: dayjs.UnitType): Wrapper {
    return new Wrapper(this.instance.subtract(value, unit as dayjs.ManipulateType))
  }

  addDay(value: number): Wrapper {
    return this.add(value, 'day')
  }

  getFirstDayOfMonth(): Wrapper {
    return new Wrapper(this.instance.startOf('month'))
  }

  getEndDayOfMonth(): Wrapper {
    // 00:00
    return new Wrapper(this.instance.endOf('month').startOf('date'))
  }

  resetTime(): Wrapper {
    // 00:00
    return new Wrapper(this.instance.startOf('date'))
  }
  /* ==== Method Chain ==== */

  /**
   * 日付を数値型で取得
   * @returns {Number} 日付（YYYYMMDD)
   */
  getDateNumber(): number {
    return parseInt(this.instance.format('YYYYMMDD'))
  }

  /**
   * 日時の単位で指定した値を取得
   * @param {String} unit 単位(date, day, month, year, hour, minute, second, millisecond)
   * @returns {Number} 指定した単位の値
   */
  get(unit: dayjs.UnitType): number {
    return this.instance.get(unit as dayjs.UnitType)
  }

  toDate(): Date {
    return this.instance.toDate()
  }

  format(template: string): string {
    return this.instance.format(template)
  }

  /**
   * 月に何日あるか
   */
  daysInMonth(): number {
    return this.instance.daysInMonth()
  }

  /**
   * 月の第何週か
   */
  getWeekIndex(): number {
    return Math.ceil(this.instance.get('date') / 7)
  }

  /**
   * 差分を取得
   * @param unit 単位(date, day, month, year, hour, minute, second, millisecond)
   */
  diff(dateObj: Wrapper, unit: dayjs.UnitType): number {
    return this.instance.diff(dateObj.instance, unit)
  }
}
