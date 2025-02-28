import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  onLabel = 'On',
  offLabel = 'Off',
  disabled = false,
  className = '',
}: ToggleSwitchProps) {
  return (
    <div className={`toggle-switch ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          disabled={disabled}
          className={`
            relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
            transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${checked ? 'bg-blue-600' : 'bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="switch"
          aria-checked={checked}
        >
          <span className="sr-only">{checked ? onLabel : offLabel}</span>
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
              transition ease-in-out duration-200
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
        
        {(onLabel || offLabel) && (
          <span className="ml-3 text-sm text-gray-700">
            {checked ? onLabel : offLabel}
          </span>
        )}
      </div>
    </div>
  );
}