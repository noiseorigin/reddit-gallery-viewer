'use client';

import { useState, useRef, useEffect } from 'react';

export interface MenuItem {
  name: string;
  displayName: string;
  [key: string]: any;
}

interface DropdownMenuProps<T extends MenuItem = MenuItem> {
  icon: string;
  label: string;
  items: T[];
  currentItem: T;
  onSelect: (item: T) => void;
  primaryColor: string;
}

export function DropdownMenu<T extends MenuItem = MenuItem>({
  icon,
  label,
  items,
  currentItem,
  onSelect,
  primaryColor,
}: DropdownMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-white hover:shadow-md text-xs"
        style={{ backgroundColor: primaryColor }}
        title={label}
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border-2 rounded-lg shadow-lg z-50 min-w-max" style={{ borderColor: primaryColor }}>
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                currentItem.name === item.name
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={
                currentItem.name === item.name
                  ? { backgroundColor: primaryColor }
                  : {}
              }
            >
              {item.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
