import { dateDiff, dateFactory, forDayEach, forDayReverseEach } from "../../src/Util/DateUtil"

describe('DateUtil #dateDiff', () => {
  test('差分が3日', () => {
    const diff = dateDiff(new Date('2024-01-01'), new Date('2024-01-04'), 'day')
    expect(diff).toBe(3)
  })
})

describe('DateUtil #forDayEach', () => {
  test('32日繰り返す', () => {
    let counter = 0
    forDayEach(new Date('2024-01-01'), new Date('2024-02-01'), (date: Date) => {
      counter++
      return false
    })
    expect(counter).toBe(32)
  })

  test('最初の値が2024/1/1', () => {
    const list: Date[] = []
    forDayEach(new Date('2024-01-01'), new Date('2024-02-01'), (date: Date) => {
      list.push(date)
      return false
    })
    const first = list.shift()
    expect(dateFactory(first).format('YYYYMMDD')).toBe('20240101')
  })

  test('最後の値が2024/2/1', () => {
    const list: Date[] = []
    forDayEach(new Date('2024-01-01'), new Date('2024-02-01'), (date: Date) => {
      list.push(date)
      return false
    })
    const last = list.pop()
    expect(dateFactory(last).format('YYYYMMDD')).toBe('20240201')
  })
})

describe('DateUtil #forDayReverseEach', () => {
  test('32日繰り返す', () => {
    let counter = 0
    forDayReverseEach(new Date('2024-01-01'), new Date('2024-02-01'), (date: Date) => {
      counter++
      return false
    })
    expect(counter).toBe(32)
  })

  test('最初の値が2024/2/1', () => {
    const list: Date[] = []
    forDayReverseEach(new Date('2024-01-01'), new Date('2024-02-01'), (date: Date) => {
      list.push(date)
      return false
    })
    const first = list.shift()
    expect(dateFactory(first).format('YYYYMMDD')).toBe('20240201')
  })

  test('最後の値が2024/1/1', () => {
    const list: Date[] = []
    forDayReverseEach(new Date('2024-01-01'), new Date('2024-02-01'), (date: Date) => {
      list.push(date)
      return false
    })
    const last = list.pop()
    expect(dateFactory(last).format('YYYYMMDD')).toBe('20240101')
  })
})