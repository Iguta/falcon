import { useMemo } from 'react'
import { ProgressBar } from '../components/ProgressBar'
import { SectionHeader } from '../components/SectionHeader'
import { StatCard } from '../components/StatCard'
import { useFalconStore } from '../hooks/useFalconStore'
import { endOfMonth, endOfWeek, endOfYear, isSameDay, isWithinRange, startOfMonth, startOfWeek, startOfYear } from '../utils/dateUtils'

export const DashboardPage = () => {
  const { tasks, goals, categories } = useFalconStore()
  const today = new Date()

  const metrics = useMemo(() => {
    const todayTasks = tasks.filter((task) => isSameDay(new Date(task.dueDate), today))
    const weekRange = { start: startOfWeek(today), end: endOfWeek(today) }
    const monthRange = { start: startOfMonth(today), end: endOfMonth(today) }
    const yearRange = { start: startOfYear(today), end: endOfYear(today) }

    const weekTasks = tasks.filter((task) => isWithinRange(task.dueDate, weekRange.start, weekRange.end))
    const monthTasks = tasks.filter((task) => isWithinRange(task.dueDate, monthRange.start, monthRange.end))
    const yearTasks = tasks.filter((task) => isWithinRange(task.dueDate, yearRange.start, yearRange.end))

    const completionRate = (list: typeof tasks) => (list.length ? Math.round((list.filter((t) => t.completed).length / list.length) * 100) : 0)

    return {
      today: { total: todayTasks.length, percent: completionRate(todayTasks) },
      week: { total: weekTasks.length, percent: completionRate(weekTasks) },
      month: { total: monthTasks.length, percent: completionRate(monthTasks) },
      year: { total: yearTasks.length, percent: completionRate(yearTasks) },
    }
  }, [tasks, today])

  const goalSnapshots = useMemo(() => {
    const levels = ['daily', 'monthly', 'yearly'] as const
    return levels.map((level) => {
      const filtered = goals.filter((goal) => goal.level === level)
      const avg = filtered.length
        ? Math.round(filtered.reduce((acc, goal) => acc + goal.progress, 0) / filtered.length)
        : 0
      return { level, avg, total: filtered.length }
    })
  }, [goals])

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => !task.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
  }, [tasks])

  const categoryLookup = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name
      return acc
    }, {})
  }, [categories])

  return (
    <div className="page dashboard">
      <section className="card-grid">
        <StatCard title="Today" value={`${metrics.today.percent}%`} helper={`${metrics.today.total} tasks`} />
        <StatCard title="This Week" value={`${metrics.week.percent}%`} helper={`${metrics.week.total} tasks`} />
        <StatCard title="This Month" value={`${metrics.month.percent}%`} helper={`${metrics.month.total} tasks`} />
        <StatCard title="This Year" value={`${metrics.year.percent}%`} helper={`${metrics.year.total} tasks`} />
      </section>

      <section className="panel-grid">
        <div className="panel">
          <SectionHeader title="Goal Momentum" subtitle="Daily, monthly, yearly progress at a glance." />
          <div className="stack">
            {goalSnapshots.map((snapshot) => (
              <ProgressBar
                key={snapshot.level}
                value={snapshot.avg}
                label={`${snapshot.level} goals (${snapshot.total})`}
              />
            ))}
          </div>
        </div>
        <div className="panel">
          <SectionHeader title="Upcoming Focus" subtitle="Your next five open tasks." />
          <div className="stack">
            {upcomingTasks.length ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="mini-card">
                  <div>
                    <p className="mini-title">{task.title}</p>
                    <p className="muted">
                      Due {new Date(task.dueDate).toLocaleDateString()} ·{' '}
                      {categoryLookup[task.categoryId ?? ''] ?? 'No category'}
                    </p>
                  </div>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
              ))
            ) : (
              <p className="muted">No upcoming tasks. Add one to stay on track.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
