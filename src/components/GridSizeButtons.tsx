export interface GridSize {
  name: string;
  displayName: string;
  cols: number;
}

export const GRID_SIZES: GridSize[] = [
  { name: "small", displayName: "📱 Small", cols: 4 },
  { name: "medium", displayName: "🖥️ Medium", cols: 3 },
  { name: "large", displayName: "🖼️ Large", cols: 2 },
];

interface GridSizeButtonsProps {
  options: GridSize[];
  currentSize: GridSize;
  onSelect: (size: GridSize) => void;
  primaryColor: string;
}

export function GridSizeButtons({
  options,
  currentSize,
  onSelect,
  primaryColor,
}: GridSizeButtonsProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => onSelect(option)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentSize.name === option.name
              ? "text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          style={
            currentSize.name === option.name
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
