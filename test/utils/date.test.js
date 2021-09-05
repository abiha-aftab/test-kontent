import {
  formatLongDate,
  formatMonthYear,
  toDateAttribute,
} from '../../src/utils/date'

describe('date helpers', () => {
  it('formats in UTC so midnight dates do not slip a day', () => {
    expect(formatMonthYear('2020-03-01T00:00:00Z')).toBe('March 2020')
    expect(formatLongDate('2020-03-14T00:00:00Z')).toBe('Mar 14, 2020')
  })

  it('produces a machine-readable datetime attribute', () => {
    expect(toDateAttribute('2020-03-14T00:00:00Z')).toBe('2020-03-14')
  })

  it('returns nothing for missing or invalid dates', () => {
    expect(formatMonthYear(null)).toBe('')
    expect(formatLongDate('not a date')).toBe('')
    expect(toDateAttribute('')).toBeUndefined()
  })
})
