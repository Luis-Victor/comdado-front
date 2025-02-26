import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-base text-gray-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
}