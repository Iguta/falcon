import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { EmptyState } from '../components/EmptyState'
import { FilterPill } from '../components/FilterPill'
import { GoalCard } from '../components/GoalCard'
import { SectionHeader } from '../components/SectionHeader'
import { useFalconStore } from '../hooks/useFalconStore'
import type { Goal, GoalLevel } from '../types/falcon'

const goalLevels: GoalLevel[] = ['daily', 'monthly', 'yearly']

export const GoalsPage = () => {
  const { goals, categories, addGoal, updateGoal, deleteGoal } = useFalconStore()
  const [levelFilter, setLevelFilter] = useState<GoalLevel | 'all'>('all')
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState<GoalLevel>('monthly')
  const [progress, setProgress] = useState(0)
  const [categoryId, setCategoryId] = useState('')

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => (levelFilter === 'all' ? true : goal.level === levelFilter))
  }, [goals, levelFilter])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title,
        description,
        level,
        progress,
        categoryId: categoryId || undefined,
      })
      setEditingGoal(null)
    } else {
      addGoal({
        title,
        description,
        level,
        progress,
        categoryId: categoryId || undefined,
      })
    }

    setTitle('')
    setDescription('')
    setLevel('monthly')
    setProgress(0)
    setCategoryId('')
  }

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setTitle(goal.title)
    setDescription(goal.description)
    setLevel(goal.level)
    setProgress(goal.progress)
    setCategoryId(goal.categoryId ?? '')
  }

  return (
    <div className="page goals-page">
      <section className="panel">
        <SectionHeader title="Goal Setting" subtitle="Define yearly, monthly, and daily intentions." />
        <div className="filter-row">
          <FilterPill label="all" active={levelFilter === 'all'} onClick={() => setLevelFilter('all')} />
          {goalLevels.map((goalLevel) => (
            <FilterPill
              key={goalLevel}
              label={goalLevel}
              active={levelFilter === goalLevel}
              onClick={() => setLevelFilter(goalLevel)}
            />
          ))}
        </div>
        <div className="stack">
          {filteredGoals.length ? (
            filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                category={categories.find((cat) => cat.id === goal.categoryId)}
                onUpdate={(value) => updateGoal(goal.id, { progress: value })}
                onEdit={() => startEdit(goal)}
                onDelete={() => deleteGoal(goal.id)}
              />
            ))
          ) : (
            <EmptyState title="No goals yet" description="Add a goal to start tracking progress." />
          )}
        </div>
      </section>
      <section className="panel form-panel">
        <SectionHeader
          title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
          subtitle="Set the cadence and track progress with simple metrics."
        />
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Goal title
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
            Level
            <select className="input" value={level} onChange={(event) => setLevel(event.target.value as GoalLevel)}>
              {goalLevels.map((goalLevel) => (
                <option key={goalLevel} value={goalLevel}>
                  {goalLevel}
                </option>
              ))}
            </select>
          </label>
          <label>
            Progress ({progress}%)
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
            />
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
            {editingGoal ? 'Save updates' : 'Add goal'}
          </button>
          {editingGoal && (
            <button type="button" className="ghost" onClick={() => setEditingGoal(null)}>
              Cancel edit
            </button>
          )}
        </form>
      </section>
    </div>
  )
}
