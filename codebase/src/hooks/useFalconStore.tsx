import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Goal, Task, Theme, ThemePalette } from '../types/falcon'
import { storageService } from '../services/storageService'

interface FalconStore {
  tasks: Task[]
  goals: Goal[]
  categories: Category[]
  themes: Theme[]
  activeThemeId: string
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  toggleTaskCompletion: (taskId: string) => void
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  deleteGoal: (goalId: string) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (categoryId: string, updates: Partial<Category>) => void
  deleteCategory: (categoryId: string) => void
  addTheme: (theme: Omit<Theme, 'id'>) => void
  updateTheme: (themeId: string, updates: Partial<Theme>) => void
  deleteTheme: (themeId: string) => void
  setActiveThemeId: (themeId: string) => void
}

const FalconContext = createContext<FalconStore | null>(null)

const defaultCategories: Category[] = [
  { id: 'cat-spiritual', name: 'Spiritual', color: '#8B5CF6' },
  { id: 'cat-fitness', name: 'Physical Fitness', color: '#22C55E' },
  { id: 'cat-academics', name: 'Academics', color: '#38BDF8' },
  { id: 'cat-career', name: 'Career', color: '#F97316' },
]

const defaultPalettes: ThemePalette[] = [
  {
    background: '#0b0f1a',
    surface: '#121827',
    surfaceAlt: '#1a2238',
    text: '#f8fafc',
    muted: '#94a3b8',
    accent: '#8b5cf6',
    accentSoft: '#312e81',
    border: '#1f2937',
  },
  {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceAlt: '#273449',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#38bdf8',
    accentSoft: '#0b2a3a',
    border: '#334155',
  },
]

const defaultThemes: Theme[] = [
  { id: 'default-dark', name: 'Falcon Dark', palette: defaultPalettes[0], isDefault: true },
  { id: 'midnight-blue', name: 'Midnight Blue', palette: defaultPalettes[1], isDefault: true },
]

const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Plan weekly focus',
    description: 'Pick 3 priority tasks and align calendar blocks.',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'high',
    categoryId: 'cat-career',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Evening stretch',
    description: '15-minute recovery stretch to reset.',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium',
    categoryId: 'cat-fitness',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

const seedGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Read 12 books',
    description: 'One book every month.',
    level: 'yearly',
    progress: 35,
    categoryId: 'cat-academics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-2',
    title: 'Daily gratitude',
    description: 'Write 3 things each morning.',
    level: 'daily',
    progress: 60,
    categoryId: 'cat-spiritual',
    createdAt: new Date().toISOString(),
  },
]

const createId = () => {
  if ('randomUUID' in crypto) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  Object.entries(theme.palette).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
}

export const FalconProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [activeThemeId, setActiveThemeIdState] = useState('default-dark')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const storedTasks = storageService.loadTasks()
    const storedGoals = storageService.loadGoals()
    const storedCategories = storageService.loadCategories()
    const storedThemes = storageService.loadThemes()
    const storedActiveTheme = storageService.loadActiveThemeId()

    setTasks(storedTasks.length ? storedTasks : seedTasks)
    setGoals(storedGoals.length ? storedGoals : seedGoals)
    setCategories(storedCategories.length ? storedCategories : defaultCategories)
    setThemes(storedThemes.length ? storedThemes : defaultThemes)
    setActiveThemeIdState(storedActiveTheme || 'default-dark')
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return
    storageService.saveTasks(tasks)
  }, [tasks, initialized])

  useEffect(() => {
    if (!initialized) return
    storageService.saveGoals(goals)
  }, [goals, initialized])

  useEffect(() => {
    if (!initialized) return
    storageService.saveCategories(categories)
  }, [categories, initialized])

  useEffect(() => {
    if (!initialized) return
    storageService.saveThemes(themes)
  }, [themes, initialized])

  useEffect(() => {
    if (!initialized) return
    storageService.saveActiveThemeId(activeThemeId)
  }, [activeThemeId, initialized])

  useEffect(() => {
    if (!themes.length) return
    const activeTheme = themes.find((theme) => theme.id === activeThemeId) ?? themes[0]
    applyTheme(activeTheme)
  }, [themes, activeThemeId])

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks((prev) => [
      { ...task, id: createId(), createdAt: new Date().toISOString() },
      ...prev,
    ])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals((prev) => [
      { ...goal, id: createId(), createdAt: new Date().toISOString() },
      ...prev,
    ])
  }

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)))
  }

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories((prev) => [{ ...category, id: createId() }, ...prev])
  }

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((category) => (category.id === categoryId ? { ...category, ...updates } : category)),
    )
  }

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId))
    setTasks((prev) => prev.map((task) => (task.categoryId === categoryId ? { ...task, categoryId: undefined } : task)))
    setGoals((prev) => prev.map((goal) => (goal.categoryId === categoryId ? { ...goal, categoryId: undefined } : goal)))
  }

  const addTheme = (theme: Omit<Theme, 'id'>) => {
    setThemes((prev) => [{ ...theme, id: createId() }, ...prev])
  }

  const updateTheme = (themeId: string, updates: Partial<Theme>) => {
    setThemes((prev) => prev.map((theme) => (theme.id === themeId ? { ...theme, ...updates } : theme)))
  }

  const deleteTheme = (themeId: string) => {
    setThemes((prev) => prev.filter((theme) => theme.id !== themeId))
    if (themeId === activeThemeId) {
      setActiveThemeIdState('default-dark')
    }
  }

  const setActiveThemeId = (themeId: string) => {
    setActiveThemeIdState(themeId)
  }

  const value = useMemo(
    () => ({
      tasks,
      goals,
      categories,
      themes,
      activeThemeId,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      addGoal,
      updateGoal,
      deleteGoal,
      addCategory,
      updateCategory,
      deleteCategory,
      addTheme,
      updateTheme,
      deleteTheme,
      setActiveThemeId,
    }),
    [tasks, goals, categories, themes, activeThemeId],
  )

  return <FalconContext.Provider value={value}>{children}</FalconContext.Provider>
}

export const useFalconStore = () => {
  const context = useContext(FalconContext)
  if (!context) {
    throw new Error('useFalconStore must be used within FalconProvider')
  }
  return context
}
