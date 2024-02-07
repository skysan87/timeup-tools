/**
 * 小数点以下第2位まで表示
 *
 * @param {String | Number} value
 * @param {Number} defaultValue
 * @returns {Number} 小数点以下第2位まで
 */
export function fixFloat (value: string | number, defaultValue: number = 0): number {
  if (!value) {
    return defaultValue
  }

  // NOTE: Number.isFiniteと異なり、文字列型を数値に変換する
  if (!isFinite(value as number)) {
    return defaultValue
  }
  // TODO: 指数表記`1e+32`などに未対応
  return parseFloat(parseFloat(value as string).toFixed(2))
}
