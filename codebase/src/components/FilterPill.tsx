interface FilterPillProps {
  label: string
  active?: boolean
  onClick: () => void
}

export const FilterPill = ({ label, active, onClick }: FilterPillProps) => (
  <button type="button" className={`filter-pill ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </button>
)
