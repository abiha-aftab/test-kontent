// Kontent stores dates as ISO strings in UTC. Formatting in UTC keeps the
// server-rendered HTML and the hydrated page identical in every time zone.
const format = (value, options) => {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    ...options,
  }).format(date)
}

export const formatMonthYear = (value) =>
  format(value, { month: 'long', year: 'numeric' })

export const formatLongDate = (value) =>
  format(value, { day: 'numeric', month: 'short', year: 'numeric' })

export const toDateAttribute = (value) => {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return undefined
  return date.toISOString().slice(0, 10)
}
