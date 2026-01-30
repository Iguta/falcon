import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { useFalconStore } from '../hooks/useFalconStore'
import type { Priority } from '../types/falcon'
import { getMonthMatrix } from '../utils/calendarUtils'
import { formatLongDate, isSameDay, toDateKey } from '../utils/dateUtils'

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const priorities: Priority[] = ['low', 'medium', 'high']

export const CalendarPage = () => {
  const { tasks, categories, addTask, toggleTaskCompletion, deleteTask } = useFalconStore()
  const [activeDate, setActiveDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())
  const [quickTitle, setQuickTitle] = useState('')
  const [quickPriority, setQuickPriority] = useState<Priority>('medium')
  const [quickCategory, setQuickCategory] = useState('')

  const monthMatrix = useMemo(() => getMonthMatrix(activeDate), [activeDate])

  const tasksByDay = useMemo(() => {
    return tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
      const key = task.dueDate
      acc[key] = acc[key] ? [...acc[key], task] : [task]
      return acc
    }, {})
  }, [tasks])

  const selectedKey = selectedDay ? toDateKey(selectedDay) : ''
  const selectedTasks = selectedKey ? tasksByDay[selectedKey] ?? [] : []

  const handleQuickAdd = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedDay || !quickTitle.trim()) return
    addTask({
      title: quickTitle,
      description: '',
      dueDate: toDateKey(selectedDay),
      priority: quickPriority,
      categoryId: quickCategory || undefined,
      completed: false,
    })
    setQuickTitle('')
    setQuickPriority('medium')
    setQuickCategory('')
  }

  return (
    <div className="page calendar-page">
      <section className="panel calendar-panel">
        <SectionHeader
          title="Calendar"
          subtitle="Calendar-first planning with day zoom for quick context."
          action={
            <div className="calendar-actions">
              <button type="button" className="ghost" onClick={() => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1))}>
                Prev
              </button>
              <button type="button" className="ghost" onClick={() => setActiveDate(new Date())}>
                Today
              </button>
              <button type="button" className="ghost" onClick={() => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1))}>
                Next
              </button>
            </div>
          }
        />
        <div className="calendar-meta">
          <h3>
            {activeDate.toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <p className="muted">Select a day to expand and manage tasks.</p>
        </div>
        <div className="calendar-grid">
          {weekdayLabels.map((label) => (
            <span key={label} className="calendar-label">
              {label}
            </span>
          ))}
          {monthMatrix.map((week) =>
            week.map((day) => {
              const key = day.key
              const dayTasks = tasksByDay[key] ?? []
              const isSelected = selectedDay ? isSameDay(day.date, selectedDay) : false
              return (
                <button
                  type="button"
                  key={key}
                  className={`calendar-cell ${day.isCurrentMonth ? '' : 'muted'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(day.date)}
                >
                  <div className="calendar-cell-header">
                    <span>{day.date.getDate()}</span>
                    {dayTasks.length > 0 && <span className="count">{dayTasks.length}</span>}
                  </div>
                  <div className="calendar-pills">
                    {dayTasks.slice(0, 2).map((task) => (
                      <span key={task.id} className={`pill compact ${task.priority}`}>
                        {task.title}
                      </span>
                    ))}
                    {dayTasks.length > 2 && <span className="muted">+{dayTasks.length - 2} more</span>}
                  </div>
                </button>
              )
            }),
          )}
        </div>
      </section>
      <section className="panel day-panel">
        <SectionHeader
          title={selectedDay ? formatLongDate(selectedKey) : 'Pick a day'}
          subtitle="Zoom in to plan or tick off tasks on a specific day."
        />
        {selectedDay ? (
          <>
            <div className="stack">
              {selectedTasks.length ? (
                selectedTasks.map((task) => (
                  <div key={task.id} className="day-task">
                    <button
                      type="button"
                      className={`checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => toggleTaskCompletion(task.id)}
                    />
                    <div>
                      <p className="mini-title">{task.title}</p>
                      <p className="muted">
                        {task.priority} · {categories.find((cat) => cat.id === task.categoryId)?.name ?? 'No category'}
                      </p>
                    </div>
                    <button type="button" className="ghost danger" onClick={() => deleteTask(task.id)}>
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="muted">No tasks scheduled for this day yet.</p>
              )}
            </div>
            <form className="form" onSubmit={handleQuickAdd}>
              <label>
                Quick add
                <input
                  className="input"
                  placeholder="Task title"
                  value={quickTitle}
                  onChange={(event) => setQuickTitle(event.target.value)}
                />
              </label>
              <label>
                Priority
                <select className="input" value={quickPriority} onChange={(event) => setQuickPriority(event.target.value as Priority)}>
                  {priorities.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select className="input" value={quickCategory} onChange={(event) => setQuickCategory(event.target.value)}>
                  <option value="">None</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="primary">
                Add to day
              </button>
            </form>
          </>
        ) : (
          <p className="muted">Choose a day to see tasks and add new ones.</p>
        )}
      </section>
    </div>
  )
}
