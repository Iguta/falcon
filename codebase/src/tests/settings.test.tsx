import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FalconProvider } from '../hooks/useFalconStore'
import { SettingsPage } from '../pages/SettingsPage'

const renderSettings = () =>
  render(
    <FalconProvider>
      <SettingsPage />
    </FalconProvider>,
  )

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a custom category', async () => {
    const user = userEvent.setup()
    renderSettings()

    await user.type(screen.getByRole('textbox', { name: /category name/i }), 'Creative')
    await user.click(screen.getByRole('button', { name: /add category/i }))

    expect(screen.getByText('Creative')).toBeInTheDocument()
  })

  it('adds a new theme', async () => {
    const user = userEvent.setup()
    renderSettings()

    const themeInput = screen.getAllByRole('textbox', { name: /theme name/i })[0]
    await user.type(themeInput, 'Aurora')
    const addThemeButton = screen.getAllByRole('button', { name: /add theme/i })[0]
    await user.click(addThemeButton)

    expect(screen.getByText('Aurora')).toBeInTheDocument()
  })
})
