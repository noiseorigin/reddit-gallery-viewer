'use client';

export interface TimeFilter {
  name: string;
  displayName: string;
}

interface TimeFilterButtonsProps {
  filters: TimeFilter[];
  currentFilter: TimeFilter;
  onSelect: (filter: TimeFilter) => void;
  primaryColor: string;
}

export function TimeFilterButtons({
  filters,
  currentFilter,
  onSelect,
  primaryColor,
}: TimeFilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.name}
          onClick={() => onSelect(filter)}
          className={`px-3 py-1 text-sm rounded font-medium transition-colors duration-200 ${
            currentFilter.name === filter.name
              ? 'text-white'
              : ''
          }`}
          style={{
            backgroundColor: currentFilter.name === filter.name ? primaryColor : '#ddd',
            color: currentFilter.name === filter.name ? 'white' : primaryColor,
          }}
        >
          {filter.displayName}
        </button>
      ))}
    </div>
  );
}
