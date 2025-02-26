import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  target?: number;
  previousValue?: number;
  format?: (value: number) => string;
  icon?: React.ReactNode;
}

export function KPICard({
  title,
  value,
  target,
  previousValue,
  format = (v) => v.toString(),
  icon,
}: KPICardProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const percentageChange = previousValue
    ? ((numericValue - previousValue) / previousValue) * 100
    : null;
  const percentageToTarget = target
    ? ((numericValue / target) * 100)
    : null;

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900">
            {typeof value === 'number' ? format(value) : value}
          </p>
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {percentageChange !== null && (
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              percentageChange >= 0 
                ? 'text-green-700 bg-green-50' 
                : 'text-red-700 bg-red-50'
            }`}>
              {percentageChange >= 0 ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-2">vs previous</span>
          </div>
        )}
        
        {percentageToTarget !== null && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress to target</span>
              <span className="font-medium text-gray-700">{percentageToTarget.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, percentageToTarget)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}