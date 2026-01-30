import { toDateKey } from './dateUtils'

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  key: string
}

export const getMonthMatrix = (activeDate: Date) => {
  const year = activeDate.getFullYear()
  const month = activeDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7
  const matrix: CalendarDay[][] = []

  let current = new Date(year, month, 1 - startDayIndex)
  for (let week = 0; week < 6; week += 1) {
    const weekRow: CalendarDay[] = []
    for (let day = 0; day < 7; day += 1) {
      weekRow.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        key: toDateKey(current),
      })
      current.setDate(current.getDate() + 1)
    }
    matrix.push(weekRow)
  }

  return matrix
}
