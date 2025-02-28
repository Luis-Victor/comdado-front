import React from 'react';
import { FilterConfig, FilterType } from '../../lib/types/filters';
import { DatePicker } from './DatePicker';
import { FilterDropdown } from './FilterDropdown';
import { SearchBar } from './SearchBar';
import { RangeSlider } from './RangeSlider';
import { CheckboxGroup } from './CheckboxGroup';
import { RadioGroup } from './RadioGroup';
import { ToggleSwitch } from './ToggleSwitch';

interface FilterRendererProps {
  config: FilterConfig;
  value: any;
  onChange: (value: any) => void;
}

export function FilterRenderer({ config, value, onChange }: FilterRendererProps) {
  // Use the value from props or fall back to default value from config
  const currentValue = value !== undefined ? value : config.defaultValue;
  
  // Common props for all filter components
  const commonProps = {
    label: config.label,
    disabled: config.disabled,
    placeholder: config.placeholder,
    className: config.className,
  };
  
  // Render the appropriate filter component based on type
  switch (config.type) {
    case 'dateRange':
      return (
        <DatePicker
          {...commonProps}
          startDate={Array.isArray(currentValue) ? currentValue[0] : ''}
          endDate={Array.isArray(currentValue) ? currentValue[1] : ''}
          onStartDateChange={(date) => onChange([date, Array.isArray(currentValue) ? currentValue[1] : ''])}
          onEndDateChange={(date) => onChange([Array.isArray(currentValue) ? currentValue[0] : '', date])}
          minDate={config.minDate}
          maxDate={config.maxDate}
        />
      );
      
    case 'dropdown':
      return (
        <FilterDropdown
          {...commonProps}
          options={config.options}
          value={Array.isArray(currentValue) ? currentValue : [currentValue]}
          onChange={onChange}
          multiple={config.multiple}
        />
      );
      
    case 'search':
      return (
        <SearchBar
          {...commonProps}
          onSearch={onChange}
          debounceMs={config.debounceMs}
        />
      );
      
    case 'rangeSlider':
      return (
        <RangeSlider
          {...commonProps}
          min={config.min}
          max={config.max}
          step={config.step}
          value={Array.isArray(currentValue) ? currentValue : [config.min, config.max]}
          onChange={onChange}
          formatValue={config.formatValue}
        />
      );
      
    case 'checkbox':
      return (
        <CheckboxGroup
          {...commonProps}
          options={config.options}
          value={Array.isArray(currentValue) ? currentValue : []}
          onChange={onChange}
          layout={config.layout}
          columns={config.columns}
        />
      );
      
    case 'radio':
      return (
        <RadioGroup
          {...commonProps}
          options={config.options}
          value={currentValue}
          onChange={onChange}
          layout={config.layout}
        />
      );
      
    case 'toggle':
      return (
        <ToggleSwitch
          {...commonProps}
          checked={Boolean(currentValue)}
          onChange={onChange}
          onLabel={config.onLabel}
          offLabel={config.offLabel}
        />
      );
      
    default:
      return (
        <div className="text-red-500">
          Unknown filter type: {(config as any).type}
        </div>
      );
  }
}