import React from 'react';
import { FilterOption } from '../../lib/types/filters';

interface CheckboxGroupProps {
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  disabled?: boolean;
  className?: string;
}

export function CheckboxGroup({
  options,
  value,
  onChange,
  label,
  layout = 'vertical',
  columns = 2,
  disabled = false,
  className = '',
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  // Determine the layout class
  const layoutClass = layout === 'horizontal' 
    ? 'flex flex-wrap gap-4' 
    : layout === 'grid' 
      ? `grid grid-cols-1 sm:grid-cols-${Math.min(columns, 4)} gap-3` 
      : 'flex flex-col space-y-2';

  return (
    <div className={`checkbox-group ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={layoutClass}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`checkbox-${option.value}`}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled || option.disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`checkbox-${option.value}`}
              className={`ml-2 text-sm ${
                disabled || option.disabled ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}