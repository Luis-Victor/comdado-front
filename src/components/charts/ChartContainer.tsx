import React from 'react';

interface ChartContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer = React.memo(function ChartContainer({ 
  title, 
  description,
  children, 
  className = '' 
}: ChartContainerProps) {
  return (
    <div className={`w-full h-[400px] bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      )}
      <div className="w-full h-[calc(100%-2.5rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
});