import { useMemo, useState } from 'react'
import { CalendarPage } from '../pages/CalendarPage'
import { DashboardPage } from '../pages/DashboardPage'
import { GoalsPage } from '../pages/GoalsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TasksPage } from '../pages/TasksPage'

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'goals', label: 'Goals' },
  { id: 'settings', label: 'Themes & Categories' },
] as const

type NavId = (typeof navItems)[number]['id']

export const AppShell = () => {
  const [activeNav, setActiveNav] = useState<NavId>('dashboard')

  const activePage = useMemo(() => {
    switch (activeNav) {
      case 'tasks':
        return <TasksPage />
      case 'calendar':
        return <CalendarPage />
      case 'goals':
        return <GoalsPage />
      case 'settings':
        return <SettingsPage />
      case 'dashboard':
      default:
        return <DashboardPage />
    }
  }, [activeNav])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <p className="brand-title">Falcon</p>
            <span className="brand-subtitle">Personal Productivity</span>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-card">
            <p className="caption">Focus reminder</p>
            <p className="caption-strong">Schedule one deep work block today.</p>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="page-title">Keep momentum, keep calm.</h1>
          </div>
          <div className="top-actions">
            <div className="pill">No login required</div>
            <div className="pill accent">Dark theme ready</div>
          </div>
        </header>
        {activePage}
      </main>
    </div>
  )
}
