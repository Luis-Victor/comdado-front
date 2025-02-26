// Utility functions for formatting data
export const formatCurrency = (value: number): string => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);

export const formatPercentage = (value: number): string =>
  `${value.toFixed(1)}%`;

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-US').format(value);

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);