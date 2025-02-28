import React from 'react';
import { FilterOption } from '../../lib/types/filters';

interface RadioGroupProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  layout?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  layout = 'vertical',
  disabled = false,
  className = '',
}: RadioGroupProps) {
  const layoutClass = layout === 'horizontal' 
    ? 'flex flex-wrap gap-4' 
    : 'flex flex-col space-y-2';

  return (
    <div className={`radio-group ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={layoutClass}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`radio-${option.value}`}
              name={label?.replace(/\s+/g, '-').toLowerCase() || 'radio-group'}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled || option.disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor={`radio-${option.value}`}
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