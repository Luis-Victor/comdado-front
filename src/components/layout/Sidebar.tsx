import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Wand2,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chart Docs', href: '/docs/charts', icon: BookOpen },
  { name: 'Magic Charts', href: '/magic-charts', icon: Wand2 },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar({ isOpen, isExpanded, onClose, onToggleExpand }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 bottom-0 left-0 flex flex-col z-20 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isExpanded ? 'md:w-64' : 'md:w-16'}`}
      >
        {/* Mobile close button */}
        <div className="absolute right-0 p-1 md:hidden">
          <button
            onClick={onClose}
            className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Collapse button */}
        <button
          onClick={onToggleExpand}
          className="hidden md:flex items-center justify-center h-10 w-full hover:bg-gray-100 focus:outline-none"
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  onClick={() => onClose()}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon
                    className={`${
                      isActive(item.href)
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    } flex-shrink-0 h-6 w-6`}
                  />
                  <span 
                    className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                      isExpanded ? 'opacity-100' : 'opacity-0 md:hidden'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <nav className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    onClick={() => onClose()}
                    title={!isExpanded ? item.name : undefined}
                  >
                    <Icon className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 h-6 w-6" />
                    <span 
                      className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                        isExpanded ? 'opacity-100' : 'opacity-0 md:hidden'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}