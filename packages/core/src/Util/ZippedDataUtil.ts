import { Array32, Flag, FullYear, HexNumber, ZippedData } from "../Domain/ValueObject"

/**
 * 解凍(16進数->2進数)
 * @description
 *  月単位のデータをフラグ(2進数)で管理している。
 *  永続化する場合、圧縮して16進数に変換している。
 *  一月は32bitに収まるので、16進数では0〜FFFFFFFFで表される
 * @param monthlyHexData 圧縮データ(16進数)
 * @returns 解凍データ(32個の2進数)
 */
export function unzip(monthlyHexData: HexNumber): Array32<Flag> {
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
export function zip(monthlyBitData: Array32<Flag>): HexNumber {
  return parseInt(monthlyBitData.join(''), 2).toString(16) as HexNumber
}

/**
 * 実施予定/実績から対象月の予定を取得
 * @param zipedArray plan/result
 * @param year 年(西暦)
 * @param month 月(0-11)
 * @return 日付(YYYY-MM-DD)の配列
 */
export function getTargetMonth(zipedArray: ZippedData, year: FullYear, month: number): string[] {
  if (!zipedArray[year]) {
    return []
  }

  const lastDay = new Date(year, month + 1, 0).getDate()
  const unzipedDays = unzip(zipedArray[year][month])
  const targetDays: string[] = []
  const actualMonth = month + 1

  for (let i = 1; i <= lastDay; i++) {
    if (unzipedDays[i] === Flag.ON) {
      targetDays.push(`${year}-${actualMonth}-${i}`)
    }
  }
  return targetDays
}
