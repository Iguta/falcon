import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FalconProvider } from '../hooks/useFalconStore'
import { CalendarPage } from '../pages/CalendarPage'

const renderCalendar = () =>
  render(
    <FalconProvider>
      <CalendarPage />
    </FalconProvider>,
  )

describe('CalendarPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows tasks for the selected day', () => {
    renderCalendar()

    expect(screen.getAllByText(/Plan weekly focus/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/zoom in to plan/i)).toBeInTheDocument()
  })
})
