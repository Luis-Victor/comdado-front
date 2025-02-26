import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  label?: string;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  minDate,
  maxDate,
}: DatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex space-x-3">
        <div className="relative flex-1 group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Calendar className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={minDate}
            max={endDate || maxDate}
            className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm
                     transition-all duration-200
                     placeholder:text-gray-400
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                     hover:border-gray-400"
            placeholder="Start date"
          />
        </div>
        <div className="relative flex-1 group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Calendar className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || minDate}
            max={maxDate}
            className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm
                     transition-all duration-200
                     placeholder:text-gray-400
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                     hover:border-gray-400"
            placeholder="End date"
          />
        </div>
      </div>
    </div>
  );
}