export const toDateKey = (date: Date) => date.toISOString().split('T')[0]

export const formatShortDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export const formatLongDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export const isSameDay = (a: Date, b: Date) => toDateKey(a) === toDateKey(b)

export const startOfWeek = (date: Date) => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1)
  result.setDate(diff)
  result.setHours(0, 0, 0, 0)
  return result
}

export const endOfWeek = (date: Date) => {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

export const isWithinRange = (dateString: string, start: Date, end: Date) => {
  const date = new Date(dateString)
  return date >= start && date <= end
}

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
export const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const startOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1)
export const endOfYear = (date: Date) => new Date(date.getFullYear(), 11, 31)
