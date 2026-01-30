import { useState } from 'react'
import type { FormEvent } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { useFalconStore } from '../hooks/useFalconStore'
import type { ThemePalette } from '../types/falcon'

const emptyPalette: ThemePalette = {
  background: '#0b0f1a',
  surface: '#121827',
  surfaceAlt: '#1a2238',
  text: '#f8fafc',
  muted: '#94a3b8',
  accent: '#8b5cf6',
  accentSoft: '#312e81',
  border: '#1f2937',
}

export const SettingsPage = () => {
  const {
    categories,
    themes,
    activeThemeId,
    addCategory,
    updateCategory,
    deleteCategory,
    addTheme,
    deleteTheme,
    setActiveThemeId,
  } = useFalconStore()

  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState('#8b5cf6')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const [themeName, setThemeName] = useState('')
  const [palette, setPalette] = useState<ThemePalette>(emptyPalette)

  const submitCategory = (event: FormEvent) => {
    event.preventDefault()
    if (!categoryName.trim()) return

    if (editingCategoryId) {
      updateCategory(editingCategoryId, { name: categoryName, color: categoryColor })
      setEditingCategoryId(null)
    } else {
      addCategory({ name: categoryName, color: categoryColor })
    }
    setCategoryName('')
    setCategoryColor('#8b5cf6')
  }

  const startEditCategory = (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId)
    if (!category) return
    setEditingCategoryId(category.id)
    setCategoryName(category.name)
    setCategoryColor(category.color)
  }

  const submitTheme = (event: FormEvent) => {
    event.preventDefault()
    if (!themeName.trim()) return
    addTheme({ name: themeName, palette })
    setThemeName('')
    setPalette(emptyPalette)
  }

  const updatePalette = (key: keyof ThemePalette, value: string) => {
    setPalette((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="page settings-page">
      <section className="panel">
        <SectionHeader title="Categories" subtitle="Organize goals and tasks into meaningful themes." />
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="card category-card">
              <div className="category-preview" style={{ background: category.color }} />
              <div>
                <p className="mini-title">{category.name}</p>
                <p className="muted">Color code</p>
              </div>
              <div className="inline-actions">
                <button type="button" className="ghost" onClick={() => startEditCategory(category.id)}>
                  Edit
                </button>
                <button type="button" className="ghost danger" onClick={() => deleteCategory(category.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <form className="form" onSubmit={submitCategory}>
          <label>
            Category name
            <input className="input" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
          </label>
          <label>
            Color
            <input type="color" value={categoryColor} onChange={(event) => setCategoryColor(event.target.value)} />
          </label>
          <button type="submit" className="primary">
            {editingCategoryId ? 'Update category' : 'Add category'}
          </button>
          {editingCategoryId && (
            <button type="button" className="ghost" onClick={() => setEditingCategoryId(null)}>
              Cancel edit
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <SectionHeader title="Themes" subtitle="Create custom palettes and switch instantly." />
        <div className="theme-grid">
          {themes.map((theme) => (
            <div key={theme.id} className={`card theme-card ${activeThemeId === theme.id ? 'active' : ''}`}>
              <div className="theme-preview" style={{ background: theme.palette.background }}>
                <span className="theme-dot" style={{ background: theme.palette.accent }} />
                <span className="theme-dot" style={{ background: theme.palette.surface }} />
                <span className="theme-dot" style={{ background: theme.palette.surfaceAlt }} />
              </div>
              <div>
                <p className="mini-title">{theme.name}</p>
                <p className="muted">{theme.isDefault ? 'Default' : 'Custom'}</p>
              </div>
              <div className="inline-actions">
                <button type="button" className="ghost" onClick={() => setActiveThemeId(theme.id)}>
                  {activeThemeId === theme.id ? 'Active' : 'Use'}
                </button>
                {!theme.isDefault && (
                  <button type="button" className="ghost danger" onClick={() => deleteTheme(theme.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <form className="form" onSubmit={submitTheme}>
          <label>
            Theme name
            <input className="input" value={themeName} onChange={(event) => setThemeName(event.target.value)} />
          </label>
          <div className="palette-grid">
            {Object.entries(palette).map(([key, value]) => (
              <label key={key}>
                {key}
                <input type="color" value={value} onChange={(event) => updatePalette(key as keyof ThemePalette, event.target.value)} />
              </label>
            ))}
          </div>
          <button type="submit" className="primary">
            Add theme
          </button>
        </form>
      </section>
    </div>
  )
}
