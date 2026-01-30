interface StatCardProps {
  title: string
  value: string
  helper: string
}

export const StatCard = ({ title, value, helper }: StatCardProps) => (
  <div className="stat-card">
    <div>
      <p className="caption">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
    <p className="stat-helper">{helper}</p>
  </div>
)
