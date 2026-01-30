export type Priority = 'low' | 'medium' | 'high'
export type GoalLevel = 'yearly' | 'monthly' | 'daily'

export interface Category {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  categoryId?: string
  completed: boolean
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  level: GoalLevel
  categoryId?: string
  targetDate?: string
  progress: number
  createdAt: string
}

export interface ThemePalette {
  background: string
  surface: string
  surfaceAlt: string
  text: string
  muted: string
  accent: string
  accentSoft: string
  border: string
}

export interface Theme {
  id: string
  name: string
  palette: ThemePalette
  isDefault?: boolean
}
