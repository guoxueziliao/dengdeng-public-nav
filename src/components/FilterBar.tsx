import type { SiteTag } from '../data/sites'

type FilterBarProps = {
  filters: Array<'全部' | SiteTag>
  activeFilters: SiteTag[]
  onToggle: (filter: SiteTag) => void
  onReset: () => void
}

export function FilterBar({ filters, activeFilters, onToggle, onReset }: FilterBarProps) {
  return (
    <div className="filter-bar" aria-label="站点筛选">
      {filters.map((filter) => (
        <button
          className="filter-button"
          data-active={filter === '全部' ? activeFilters.length === 0 : activeFilters.includes(filter)}
          key={filter}
          onClick={() => {
            if (filter === '全部') {
              onReset()
              return
            }

            onToggle(filter)
          }}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
