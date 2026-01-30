import type { Category, Goal } from '../types/falcon'
import { ProgressBar } from './ProgressBar'

interface GoalCardProps {
  goal: Goal
  category?: Category
  onUpdate: (progress: number) => void
  onEdit: () => void
  onDelete: () => void
}

export const GoalCard = ({ goal, category, onUpdate, onEdit, onDelete }: GoalCardProps) => (
  <div className="card goal-card">
    <div className="goal-header">
      <div>
        <div className="goal-title">
          <h4>{goal.title}</h4>
          <span className="level">{goal.level}</span>
        </div>
        <p className="muted">{goal.description || 'Define the why behind this goal.'}</p>
      </div>
      <div className="goal-actions">
        <button type="button" className="ghost" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="ghost danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
    <div className="goal-meta">
      {category && (
        <span className="tag" style={{ background: category.color }}>
          {category.name}
        </span>
      )}
      <span className="muted">Progress</span>
    </div>
    <ProgressBar value={goal.progress} />
    <input
      type="range"
      min={0}
      max={100}
      value={goal.progress}
      onChange={(event) => onUpdate(Number(event.target.value))}
    />
  </div>
)
