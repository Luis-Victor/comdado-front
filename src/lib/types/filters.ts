/**
 * Types for dashboard filters
 */

export type FilterType = 
  | 'dropdown'
  | 'dateRange'
  | 'search'
  | 'rangeSlider'
  | 'checkbox'
  | 'radio'
  | 'toggle';

export type FilterPlacement = 
  | 'topbar'
  | 'sidebar'
  | 'inline'
  | 'floating';

export type FilterAlignment = 
  | 'left'
  | 'center'
  | 'right';

export type FilterSize = 
  | 'small'
  | 'medium'
  | 'large';

export type FilterValueType = 
  | string
  | string[]
  | number
  | number[]
  | boolean
  | [Date | string, Date | string]; // For date ranges

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  group?: string;
}

export interface BaseFilterConfig {
  id: string;
  type: FilterType;
  label: string;
  placement: FilterPlacement;
  alignment?: FilterAlignment;
  size?: FilterSize;
  defaultValue?: FilterValueType;
  value?: FilterValueType;
  required?: boolean;
  disabled?: boolean;
  visible?: boolean;
  clearable?: boolean;
  placeholder?: string;
  description?: string;
  affectsComponents?: string[] | 'all';
  dependsOn?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  responsive?: {
    visibleOn?: ('sm' | 'md' | 'lg' | 'xl')[];
    fullWidthOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  };
  className?: string;
  onChange?: (value: FilterValueType) => void;
}

export interface DropdownFilterConfig extends BaseFilterConfig {
  type: 'dropdown';
  options: FilterOption[];
  multiple?: boolean;
  searchable?: boolean;
  groupBy?: string;
  maxItems?: number;
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'dateRange';
  presets?: {
    label: string;
    value: [string, string];
  }[];
  minDate?: string;
  maxDate?: string;
  format?: string;
  singleDate?: boolean;
}

export interface SearchFilterConfig extends BaseFilterConfig {
  type: 'search';
  debounceMs?: number;
  searchFields?: string[];
  minLength?: number;
}

export interface RangeSliderFilterConfig extends BaseFilterConfig {
  type: 'rangeSlider';
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  range?: boolean; // If true, allows selecting a range; if false, single value
}

export interface CheckboxFilterConfig extends BaseFilterConfig {
  type: 'checkbox';
  options: FilterOption[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number; // For grid layout
}

export interface RadioFilterConfig extends BaseFilterConfig {
  type: 'radio';
  options: FilterOption[];
  layout?: 'vertical' | 'horizontal';
}

export interface ToggleFilterConfig extends BaseFilterConfig {
  type: 'toggle';
  onLabel?: string;
  offLabel?: string;
}

export type FilterConfig = 
  | DropdownFilterConfig
  | DateRangeFilterConfig
  | SearchFilterConfig
  | RangeSliderFilterConfig
  | CheckboxFilterConfig
  | RadioFilterConfig
  | ToggleFilterConfig;

export interface FilterBarConfig {
  id: string;
  placement: FilterPlacement;
  alignment?: FilterAlignment;
  filters: string[]; // IDs of filters to include
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showFilterCount?: boolean;
  showClearAll?: boolean;
  className?: string;
  responsive?: {
    stackOn?: ('sm' | 'md' | 'lg' | 'xl')[];
    hideOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  };
}

export interface DashboardFiltersConfig {
  filters: FilterConfig[];
  filterBars: FilterBarConfig[];
  globalSettings?: {
    syncWithUrl?: boolean;
    persistFilters?: boolean;
    storageKey?: string;
    defaultCollapsed?: boolean;
    animateChanges?: boolean;
    showFilterSummary?: boolean;
  };
}