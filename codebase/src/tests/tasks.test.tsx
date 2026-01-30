import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FalconProvider } from '../hooks/useFalconStore'
import { TasksPage } from '../pages/TasksPage'

const renderTasks = () =>
  render(
    <FalconProvider>
      <TasksPage />
    </FalconProvider>,
  )

describe('TasksPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a new task with a due date and priority', async () => {
    const user = userEvent.setup()
    renderTasks()

    await user.type(screen.getByLabelText(/task title/i), 'Ship weekly review')
    await user.type(screen.getByLabelText(/description/i), 'Summarize wins and blockers')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText('Ship weekly review')).toBeInTheDocument()
  })

  it('filters tasks with search', async () => {
    const user = userEvent.setup()
    renderTasks()

    const searchInput = screen.getAllByPlaceholderText(/search tasks/i)[0]
    fireEvent.change(searchInput, { target: { value: 'Evening' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('Evening')
    })

    expect(screen.getAllByText(/Evening stretch/i).length).toBeGreaterThan(0)
    await waitFor(() => {
      expect(screen.getByText(/showing 1 task/i)).toBeInTheDocument()
    })
  })
})
