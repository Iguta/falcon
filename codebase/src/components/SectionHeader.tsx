import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="section-header">
    <div>
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
    </div>
    {action}
  </div>
)
