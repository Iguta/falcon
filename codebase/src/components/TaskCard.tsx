import type { Category, Task } from '../types/falcon'
import { formatShortDate } from '../utils/dateUtils'

interface TaskCardProps {
  task: Task
  category?: Category
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export const TaskCard = ({ task, category, onToggle, onEdit, onDelete }: TaskCardProps) => (
  <div className="card task-card">
    <div className="task-main">
      <button
        type="button"
        className={`checkbox ${task.completed ? 'checked' : ''}`}
        onClick={onToggle}
        aria-label="Toggle task"
      />
      <div>
        <div className="task-title-row">
          <h4 className={task.completed ? 'muted' : ''}>{task.title}</h4>
          <span className={`priority ${task.priority}`}>{task.priority}</span>
        </div>
        <p className="muted">{task.description || 'No description yet.'}</p>
        <div className="task-meta">
          <span>{formatShortDate(task.dueDate)}</span>
          {category && (
            <span className="tag" style={{ background: category.color }}>
              {category.name}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="task-actions">
      <button type="button" className="ghost" onClick={onEdit}>
        Edit
      </button>
      <button type="button" className="ghost danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  </div>
)
