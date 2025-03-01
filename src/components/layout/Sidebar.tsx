import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Wand2,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  ChevronDown,
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Package,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { dashboardTemplates } from '../../lib/config/templates';

interface SidebarProps {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
}

// Consolidated dashboards into a single item
const dashboardItems = [
  { name: 'Sales Dashboard', href: '/dashboard', icon: BarChart },
  { name: 'Inventory Dashboard', href: '/inventory', icon: Package },
  { name: 'Marketing Dashboard', href: '/marketing', icon: TrendingUp },
];

const navigation = [
  // Dashboards will be handled separately
  { name: 'Chart Docs', href: '/docs/charts', icon: BookOpen },
  { name: 'Magic Charts', href: '/magic-charts', icon: Wand2 },
  { name: 'Create Dashboard', href: '/dashboard/create', icon: PlusSquare },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar({ isOpen, isExpanded, onClose, onToggleExpand }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const dashboardDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setShowTemplateDropdown(false);
      }
      if (dashboardDropdownRef.current && !dashboardDropdownRef.current.contains(event.target as Node)) {
        setShowDashboardDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    // Navigate to create dashboard with the selected template
    navigate(`/dashboard/create?template=${templateId}`);
    setShowTemplateDropdown(false);
    onClose();
  };

  const handleDashboardSelect = (href: string) => {
    navigate(href);
    setShowDashboardDropdown(false);
    onClose();
  };

  // Template icons mapping
  const templateIconMap: Record<string, React.ElementType> = {
    'executive-overview': Activity,
    'sales-marketing': BarChart,
    'financial-performance': LineChart,
    'operational-dashboard': PieChart
  };

  // Function to render tooltip content based on item name
  const getTooltipContent = (itemName: string) => {
    switch(itemName) {
      case 'Dashboards':
        return (
          <div className="p-2">
            <p>Access all your dashboards in one place.</p>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="font-medium">Available dashboards:</p>
              <ul className="mt-1 list-disc list-inside text-xs">
                <li>Sales Dashboard</li>
                <li>Inventory Dashboard</li>
                <li>Marketing Dashboard</li>
              </ul>
            </div>
          </div>
        );
      case 'Sales Dashboard':
        return 'View sales metrics, revenue trends, and product performance';
      case 'Inventory Dashboard':
        return 'Monitor inventory levels and identify products that need restocking';
      case 'Marketing Dashboard':
        return 'Analyze marketing campaign performance and ROI';
      case 'Create Dashboard':
        return (
          <div className="p-2">
            <p>Create customized dashboards with our intelligent template selection.</p>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="font-medium">Available templates:</p>
              <ul className="mt-1 list-disc list-inside text-xs">
                {dashboardTemplates.slice(0, 3).map(template => (
                  <li key={template.id}>{template.name}</li>
                ))}
                {dashboardTemplates.length > 3 && <li>...and more</li>}
              </ul>
            </div>
          </div>
        );
      case 'Chart Docs':
        return 'Documentation for available chart types and configurations';
      case 'Magic Charts':
        return 'AI-powered chart recommendations based on your data';
      case 'Settings':
        return 'Configure application settings and preferences';
      case 'Help':
        return 'Get help and support for using the dashboard platform';
      default:
        return itemName;
    }
  };

  // Check if any dashboard is active
  const isDashboardActive = dashboardItems.some(item => isActive(item.href));
  // Get the active dashboard if any
  const activeDashboard = dashboardItems.find(item => isActive(item.href));

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
            {/* Dashboards Dropdown */}
            <div className="relative group" ref={dashboardDropdownRef}>
              <button
                className={`w-full ${
                  isDashboardActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md`}
                onClick={() => setShowDashboardDropdown(!showDashboardDropdown)}
                onMouseEnter={() => setHoveredItem('Dashboards')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center">
                  <LayoutDashboard className={`${
                    isDashboardActive
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } flex-shrink-0 h-6 w-6`} />
                  <span 
                    className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                      isExpanded ? 'opacity-100' : 'opacity-0 md:hidden'
                    }`}
                  >
                    {activeDashboard ? activeDashboard.name : 'Dashboards'}
                  </span>
                </div>
                {isExpanded && (
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showDashboardDropdown ? 'transform rotate-180' : ''
                    }`} 
                  />
                )}
              </button>
              
              {/* Enhanced tooltip for collapsed mode */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-0 z-10 w-64 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {getTooltipContent('Dashboards')}
                </div>
              )}
              
              {hoveredItem === 'Dashboards' && isExpanded && !showDashboardDropdown && (
                <div className="absolute left-full ml-2 top-0 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                  <p>Access all your dashboards in one place.</p>
                  <p className="mt-1">View sales, inventory, and marketing metrics.</p>
                </div>
              )}
              
              {/* Dashboards dropdown */}
              {showDashboardDropdown && isExpanded && (
                <div className="absolute left-0 right-0 mt-1 z-10 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                  {dashboardItems.map(dashboard => {
                    const DashboardIcon = dashboard.icon;
                    return (
                      <button
                        key={dashboard.name}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          isActive(dashboard.href)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        } flex items-center`}
                        onClick={() => handleDashboardSelect(dashboard.href)}
                      >
                        <DashboardIcon className={`h-4 w-4 ${
                          isActive(dashboard.href) ? 'text-gray-500' : 'text-gray-400'
                        } mr-2`} />
                        <span>{dashboard.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {navigation.map((item) => {
              const Icon = item.icon;
              const isCreateDashboard = item.name === 'Create Dashboard';
              
              if (isCreateDashboard) {
                return (
                  <div key={item.name} className="relative group" ref={templateDropdownRef}>
                    <button
                      className={`w-full ${
                        isActive(item.href)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800'
                      } group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md
                      mt-2 mb-2 border border-blue-200`}
                      onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center">
                        <PlusSquare className="text-blue-500 flex-shrink-0 h-6 w-6" />
                        <span 
                          className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                            isExpanded ? 'opacity-100' : 'opacity-0 md:hidden'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                      {isExpanded && (
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            showTemplateDropdown ? 'transform rotate-180' : ''
                          }`} 
                        />
                      )}
                    </button>
                    
                    {/* Enhanced tooltip for collapsed mode */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 top-0 z-10 w-64 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {getTooltipContent(item.name)}
                      </div>
                    )}
                    
                    {hoveredItem === item.name && isExpanded && !showTemplateDropdown && (
                      <div className="absolute left-full ml-2 top-0 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                        <p>Create custom dashboards with our intelligent template selection system.</p>
                        <p className="mt-1">Choose from pre-built templates or get recommendations based on your business needs.</p>
                      </div>
                    )}
                    
                    {/* Template dropdown */}
                    {showTemplateDropdown && isExpanded && (
                      <div className="absolute left-0 right-0 mt-1 z-10 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                        <Link 
                          to={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                          onClick={() => {
                            setShowTemplateDropdown(false);
                            onClose();
                          }}
                        >
                          All Templates
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <p className="px-4 py-1 text-xs text-gray-500 uppercase font-semibold">Quick Select</p>
                        {dashboardTemplates.map(template => {
                          const TemplateIcon = templateIconMap[template.id] || Activity;
                          return (
                            <button
                              key={template.id}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => handleTemplateSelect(template.id)}
                            >
                              <TemplateIcon className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{template.name.length > 20 ? template.name.substring(0, 20) + '...' : template.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    onClick={() => onClose()}
                    title={!isExpanded ? item.name : undefined}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
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
                  
                  {/* Enhanced tooltip for collapsed mode */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 top-0 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {getTooltipContent(item.name)}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <nav className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="relative group">
                    <Link
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
                    
                    {/* Enhanced tooltip for collapsed mode */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 top-0 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {getTooltipContent(item.name)}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}