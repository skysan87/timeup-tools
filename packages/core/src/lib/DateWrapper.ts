import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ja'

dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.locale('ja')

/** 曜日 */
type DayOfWeek = 'dayOfWeek'
export type DateUnit = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | DayOfWeek
export type ManipulateUnit = Exclude<DateUnit, DayOfWeek>

/**
 * 日付取得時の単位変換
 */
const GetUnitMap = new Map<DateUnit, dayjs.UnitType>([
  ['year', 'year'],
  ['month', 'month'],
  ['day', 'date'],  // 日
  ['dayOfWeek', 'day'],
  ['hour', 'hour'],
  ['minute', 'minute'],
  ['second', 'second'],
])

/**
 * 日付操作時の単位変換
 * @see https://day.js.org/docs/en/manipulate/add
 */
const DateManipulateUnitMap = new Map<ManipulateUnit, dayjs.ManipulateType>([
  ['year', 'year'],
  ['month', 'month'],
  ['day', 'day'],
  ['hour', 'hour'],
  ['minute', 'minute'],
  ['second', 'second'],
])

/**
 * Diff操作時の単位変換
 */
const DateOpeUnitMap = new Map<ManipulateUnit, dayjs.OpUnitType>([
  ['year', 'year'],
  ['month', 'month'],
  ['day', 'day'],
  ['hour', 'hour'],
  ['minute', 'minute'],
  ['second', 'second'],
])

/**
 * Date系ライブラリのラッパークラス
 * @description
 * 他packageへexportしないこと
 */
export default class DateWrapper {

  private instance: dayjs.Dayjs

  public constructor(date?: string | number | Date, format?: string) {
    if (!date) {
      this.instance = dayjs(/* DEBUGの際はここに値を設定 */)
    } else if (!format && (typeof date === 'string' || typeof date === 'number') && /^[0-9]{8}$/.test(date.toString())) {
      this.instance = dayjs(date.toString(), 'YYYYMMDD')
    } else if (!format && date) {
      this.instance = dayjs(date)
    } else {
      this.instance = dayjs(date, format)
    }
  }

  private create(instance: dayjs.Dayjs) {
    return new DateWrapper(instance.toDate())
  }

  /* ==== Method Chain ==== */

  /**
   * 指定した単位で時間を進めた
   * @param value 値
   * @param unit 単位
   * @returns インスタンス
   */
  public add(value: number, unit: ManipulateUnit): DateWrapper {
    return this.create(this.instance.add(value, DateManipulateUnitMap.get(unit)))
  }

  /**
   * 指定した単位で時間を戻す
   * @param value 値
   * @param unit 単位
   * @returns インスタンス
   */
  public subtract(value: number, unit: ManipulateUnit): DateWrapper {
    return this.create(this.instance.subtract(value, DateManipulateUnitMap.get(unit)))
  }

  public addDay(value: number): DateWrapper {
    return this.add(value, 'day')
  }

  public getFirstDayOfMonth(): DateWrapper {
    return this.create(this.instance.startOf(GetUnitMap.get('month')!))
  }

  public getEndDayOfMonth(): DateWrapper {
    // 00:00
    return this.create(this.instance.endOf(GetUnitMap.get('month')!).startOf(GetUnitMap.get('day')!))
  }

  public resetTime(): DateWrapper {
    // 00:00
    return this.create(this.instance.startOf(GetUnitMap.get('day')!))
  }

  /* ==== Method Chain ==== */

  /**
   * 日付を数値型で取得
   * @returns {Number} 日付（YYYYMMDD)
   */
  public getDateNumber(): number {
    return parseInt(this.instance.format('YYYYMMDD'))
  }

  /**
   * 日時の単位で指定した値を取得
   * @param unit 単位
   * @returns 指定した単位の値
   */
  public get(unit: DateUnit): number {
    return this.instance.get(GetUnitMap.get(unit)!)
  }

  public toDate(): Date {
    return this.instance.toDate()
  }

  // TODO: templateのバリデーションと変換
  public format(template: string): string {
    return this.instance.format(template)
  }

  /**
   * 月に何日あるか
   */
  public daysInMonth(): number {
    return this.instance.daysInMonth()
  }

  /**
   * 月の第何週か
   */
  public getWeekIndex(): number {
    return Math.ceil(this.instance.get(GetUnitMap.get('day')!) / 7)
  }

  /**
   * 差分を取得
   * @param unit 単位
   */
  public diff(dateObj: DateWrapper, unit: ManipulateUnit): number {
    return this.instance.diff(dateObj.instance, DateOpeUnitMap.get(unit))
  }

  /**
   * 期間内か
   * @param start 期間の最初の日
   * @param end 期間の最後の日
   * @param includes 最初の日と最後の日を含むか
   */
  public isBetween(start: Date | string, end: Date | string, includes: boolean): boolean {
    return this.instance.isBetween(start, end, 'day', includes ? '[]' : '()')
  }
}