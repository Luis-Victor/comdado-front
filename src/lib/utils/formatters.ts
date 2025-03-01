/**
 * Utility functions for formatting data with enhanced type safety and options
 */

type CurrencyOptions = {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

/**
 * Format a number as currency
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | null | undefined, 
  options: CurrencyOptions = {}
): string => {
  if (value === null || value === undefined) return 'N/A';
  
  const { 
    currency = 'USD', 
    minimumFractionDigits = 0, 
    maximumFractionDigits = 0 
  } = options;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

type PercentageOptions = {
  decimals?: number;
  includeSymbol?: boolean;
};

/**
 * Format a number as percentage
 * @param value The number to format (0.1 = 10%)
 * @param options Formatting options
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number | null | undefined, 
  options: PercentageOptions = {}
): string => {
  if (value === null || value === undefined) return 'N/A';
  
  const { decimals = 1, includeSymbol = true } = options;
  const formatted = (value * 100).toFixed(decimals);
  return includeSymbol ? `${formatted}%` : formatted;
};

type NumberOptions = {
  decimals?: number;
  useGrouping?: boolean;
};

/**
 * Format a number with thousands separators
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined, 
  options: NumberOptions = {}
): string => {
  if (value === null || value === undefined) return 'N/A';
  
  const { decimals, useGrouping = true } = options;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  }).format(value);
};

type DateOptions = {
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
};

/**
 * Format a date with various format options
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | null | undefined,
  options: DateOptions = {}
): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const { format = 'medium', includeTime = false } = options;
  
  const dateTimeFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
    hour: includeTime ? 'numeric' : undefined,
    minute: includeTime ? 'numeric' : undefined,
  };
  
  return new Intl.DateTimeFormat('en-US', dateTimeFormat).format(dateObj);
};