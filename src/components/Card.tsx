import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: keyof typeof Icons;
  description?: string;
  className?: string;
}

export function Card({ title, value, change, icon, description, className = '' }: CardProps) {
  const isPositive = change && change > 0;
  const Icon = icon ? Icons[icon] : null;
  
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center">
          <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {Math.abs(change)}%
          </span>
          {description && (
            <span className="text-gray-500 text-sm ml-2">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}