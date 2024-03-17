import DateWrapper, { ManipulateUnit } from '../lib/DateWrapper'

/**
 * 指定した期間のループ処理(昇順)
 * @param {Date} startDate 開始日
 * @param {Date} endDate 終了日
 * @param {Function} callback コールバック(trueで中断)
 */
export function forDayEach(startDate: Date, endDate: Date, callback: (date: Date) => boolean) {
  _forDayEach(new DateWrapper(startDate), new DateWrapper(endDate), callback)
}

/**
 * 指定した期間のループ処理(降順)
 * @param {Date} startDate 開始日
 * @param {Date} endDate 終了日
 * @param {Function} callback コールバック(trueで中断)
 */
export function forDayReverseEach(startDate: Date, endDate: Date, callback: (date: Date) => boolean) {
  _forDayReverseEach(new DateWrapper(startDate), new DateWrapper(endDate), callback)
}

/**
 * Date差分を算出
 * @param start
 * @param end
 * @param unit
 * @returns 過去の日付->負の数. 未来の日付->正の数
 */
export function dateDiff(start: Date, end: Date, unit: ManipulateUnit): number {
  const startObj = new DateWrapper(start)
  const endObj = new DateWrapper(end)
  return _dateDiff(startObj, endObj, unit)
}

/**
 * 過去の日付->負の数. 未来の日付->正の数
 */
function _dateDiff(startDate: DateWrapper, endDate: DateWrapper, unit: ManipulateUnit): number {
  return endDate.diff(startDate, unit)
}

function _forDayEach(startDate: DateWrapper, endDate: DateWrapper, callback: (date: Date) => boolean) {
  const diffDays: number = _dateDiff(startDate, endDate, 'day')
  for (let i = 0; i <= diffDays; i++) {
    const cancel = callback(startDate.add(i, 'day').toDate())
    if (cancel) {
      break
    }
  }
}

function _forDayReverseEach(startDate: DateWrapper, endDate: DateWrapper, callback: (date: Date) => boolean) {
  const diffDays: number = _dateDiff(startDate, endDate, 'day')
  for (let i = 0; i <= diffDays; i++) {
    const cancel = callback(endDate.subtract(i, 'day').toDate())
    if (cancel) {
      break
    }
  }
}

/**
 * Factory
 */
export const dateFactory = (date?: string | number | Date, format?: string): DateWrapper => new DateWrapper(date, format)

export type DateUtil = DateWrapper