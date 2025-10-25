export interface SortOption {
  name: string;
  displayName: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { name: "best", displayName: "👍 Best" },
  { name: "hot", displayName: "🔥 Hot" },
  { name: "new", displayName: "✨ New" },
  { name: "top", displayName: "⭐ Top" },
  { name: "rising", displayName: "📈 Rising" },
];

interface SortFilterButtonsProps {
  options: SortOption[];
  currentSort: SortOption;
  onSelect: (sort: SortOption) => void;
  primaryColor: string;
}

export function SortFilterButtons({
  options,
  currentSort,
  onSelect,
  primaryColor,
}: SortFilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => onSelect(option)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentSort.name === option.name
              ? "text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          style={
            currentSort.name === option.name
              ? { backgroundColor: primaryColor }
              : {}
          }
        >
          {option.displayName}
        </button>
      ))}
    </div>
  );
}
