import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FalconProvider } from '../hooks/useFalconStore'
import { GoalsPage } from '../pages/GoalsPage'

const renderGoals = () =>
  render(
    <FalconProvider>
      <GoalsPage />
    </FalconProvider>,
  )

describe('GoalsPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a new goal with a level', async () => {
    const user = userEvent.setup()
    renderGoals()

    await user.type(screen.getByLabelText(/goal title/i), 'Publish portfolio')
    await user.selectOptions(screen.getByLabelText(/level/i), 'yearly')
    await user.click(screen.getByRole('button', { name: /add goal/i }))

    expect(screen.getByText('Publish portfolio')).toBeInTheDocument()
    expect(screen.getAllByText(/yearly/i).length).toBeGreaterThan(0)
  })
})
