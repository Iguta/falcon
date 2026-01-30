import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { EmptyState } from '../components/EmptyState'
import { FilterPill } from '../components/FilterPill'
import { SectionHeader } from '../components/SectionHeader'
import { TaskCard } from '../components/TaskCard'
import { useFalconStore } from '../hooks/useFalconStore'
import type { Priority, Task } from '../types/falcon'

const priorityOptions: Priority[] = ['low', 'medium', 'high']

export const TasksPage = () => {
  const { tasks, categories, addTask, updateTask, deleteTask, toggleTaskCompletion } = useFalconStore()
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'done'>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0])
  const [priority, setPriority] = useState<Priority>('medium')
  const [categoryId, setCategoryId] = useState<string>('')

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return tasks
      .filter((task) =>
        normalizedSearch.length === 0 ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch),
      )
      .filter((task) => (priorityFilter === 'all' ? true : task.priority === priorityFilter))
      .filter((task) => (categoryFilter === 'all' ? true : task.categoryId === categoryFilter))
      .filter((task) => {
        if (statusFilter === 'all') return true
        return statusFilter === 'done' ? task.completed : !task.completed
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [tasks, search, priorityFilter, categoryFilter, statusFilter])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        dueDate,
        priority,
        categoryId: categoryId || undefined,
      })
      setEditingTask(null)
    } else {
      addTask({
        title,
        description,
        dueDate,
        priority,
        categoryId: categoryId || undefined,
        completed: false,
      })
    }

    setTitle('')
    setDescription('')
    setDueDate(new Date().toISOString().split('T')[0])
    setPriority('medium')
    setCategoryId('')
  }

  const startEdit = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setDueDate(task.dueDate)
    setPriority(task.priority)
    setCategoryId(task.categoryId ?? '')
  }

  const taskCountLabel = `${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'}`

  return (
    <div className="page tasks-page">
      <section className="panel">
        <SectionHeader
          title="Task Management"
          subtitle="Capture tasks, set priorities, and stay clear on what matters today."
        />
        <div className="filters">
          <input
            className="input"
            placeholder="Search tasks"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="filter-row">
            {(['all', 'open', 'done'] as const).map((status) => (
              <FilterPill
                key={status}
                label={status}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              />
            ))}
          </div>
        </div>
        <div className="filter-row">
          <FilterPill label="all" active={priorityFilter === 'all'} onClick={() => setPriorityFilter('all')} />
          {priorityOptions.map((option) => (
            <FilterPill
              key={option}
              label={option}
              active={priorityFilter === option}
              onClick={() => setPriorityFilter(option)}
            />
          ))}
        </div>
        <div className="filter-row">
          <FilterPill label="all categories" active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} />
          {categories.map((category) => (
            <FilterPill
              key={category.id}
              label={category.name}
              active={categoryFilter === category.id}
              onClick={() => setCategoryFilter(category.id)}
            />
          ))}
        </div>
        <p className="muted">Showing {taskCountLabel}</p>
        <div className="stack">
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                category={categories.find((cat) => cat.id === task.categoryId)}
                onToggle={() => toggleTaskCompletion(task.id)}
                onEdit={() => startEdit(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          ) : (
            <EmptyState title="No tasks yet" description="Add a task or adjust filters to see results." />
          )}
        </div>
      </section>
      <section className="panel form-panel">
        <SectionHeader
          title={editingTask ? 'Edit Task' : 'Add New Task'}
          subtitle="Keep tasks actionable with context, due dates, and priority."
        />
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Task title
            <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Description
            <textarea
              className="input"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <label>
            Due date
            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
          <label>
            Priority
            <select className="input" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select className="input" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="primary">
            {editingTask ? 'Save updates' : 'Add task'}
          </button>
          {editingTask && (
            <button type="button" className="ghost" onClick={() => setEditingTask(null)}>
              Cancel edit
            </button>
          )}
        </form>
      </section>
    </div>
  )
}
