import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative flex items-center w-full group">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm transition-all duration-200
                 placeholder:text-gray-400
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                 hover:border-gray-400"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 transition-opacity duration-200"
          type="button"
        >
          <X 
            className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" 
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}