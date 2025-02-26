import React from 'react';
import { RangeSlider } from './RangeSlider';
import { DatePicker } from './DatePicker';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';

interface FiltersContainerProps {
  onRangeChange: (value: [number, number]) => void;
  onDateChange: (startDate: string, endDate: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (value: string[]) => void;
  rangeValue: [number, number];
  startDate: string;
  endDate: string;
  filterValue: string[];
}

export function FiltersContainer({
  onRangeChange,
  onDateChange,
  onSearch,
  onFilterChange,
  rangeValue,
  startDate,
  endDate,
  filterValue,
}: FiltersContainerProps) {
  const filterOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <RangeSlider
            min={0}
            max={100}
            value={rangeValue}
            onChange={onRangeChange}
            label="Range Filter"
            formatValue={(val) => `${val}%`}
          />
          
          <SearchBar
            onSearch={onSearch}
            placeholder="Search items..."
          />
        </div>
        
        <div className="space-y-4">
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => onDateChange(date, endDate)}
            onEndDateChange={(date) => onDateChange(startDate, date)}
            label="Date Range"
          />
          
          <FilterDropdown
            options={filterOptions}
            value={filterValue}
            onChange={onFilterChange}
            label="Custom Filter"
            placeholder="Select options"
          />
        </div>
      </div>
    </div>
  );
}