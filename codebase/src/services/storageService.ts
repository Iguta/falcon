import type { Category, Goal, Task, Theme } from '../types/falcon'

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const createStorage = <T>(key: string, fallback: T) => ({
  load: () => safeParse<T>(localStorage.getItem(key), fallback),
  save: (value: T) => localStorage.setItem(key, JSON.stringify(value)),
})

const tasksStorage = createStorage<Task[]>('falcon_tasks', [])
const goalsStorage = createStorage<Goal[]>('falcon_goals', [])
const categoriesStorage = createStorage<Category[]>('falcon_categories', [])
const themesStorage = createStorage<Theme[]>('falcon_themes', [])
const activeThemeStorage = createStorage<string>('falcon_active_theme', 'default-dark')

export const storageService = {
  loadTasks: tasksStorage.load,
  saveTasks: tasksStorage.save,
  loadGoals: goalsStorage.load,
  saveGoals: goalsStorage.save,
  loadCategories: categoriesStorage.load,
  saveCategories: categoriesStorage.save,
  loadThemes: themesStorage.load,
  saveThemes: themesStorage.save,
  loadActiveThemeId: activeThemeStorage.load,
  saveActiveThemeId: activeThemeStorage.save,
}
