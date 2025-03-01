import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
}

export function FilterDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  multiple = true,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange([optionValue]);
      setIsOpen(false);
    }
  };

  const selectedLabels = options
    .filter(option => value.includes(option.value))
    .map(option => option.label)
    .join(', ');

  return (
    <div className={`relative filter-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-3 pr-10 text-left
                   transition-all duration-200 cursor-pointer
                   hover:border-gray-400
                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-sm">
          {selectedLabels || <span className="text-gray-400">{placeholder}</span>}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto
                      border border-gray-200 py-1">
          {options.map((option) => (
            <div
              key={option.value}
              className={`
                relative py-2.5 pl-3 pr-9 text-sm cursor-pointer select-none
                transition-colors duration-150
                ${value.includes(option.value) 
                  ? 'bg-primary-50 text-primary-900' 
                  : 'text-gray-900 hover:bg-gray-50'
                }
              `}
              onClick={() => handleOptionClick(option.value)}
            >
              <span className={`block truncate ${value.includes(option.value) ? 'font-medium' : 'font-normal'}`}>
                {option.label}
              </span>
              {value.includes(option.value) && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600">
                  <Check className="h-5 w-5" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}