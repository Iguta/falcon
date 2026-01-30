import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const renderApp = () => render(<App />)

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows progress metrics after navigation', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /tasks/i }))
    await user.click(screen.getByRole('button', { name: /dashboard/i }))

    expect(screen.getByText(/goal momentum/i)).toBeInTheDocument()
    expect(screen.getAllByText(/today/i).length).toBeGreaterThan(0)
  })
})
