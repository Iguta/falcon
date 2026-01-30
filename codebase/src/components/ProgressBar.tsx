interface ProgressBarProps {
  value: number
  label?: string
}

export const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div className="progress">
      <div className="progress-label">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="progress-track">
        <span className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  )
}
