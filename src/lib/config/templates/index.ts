import executiveOverviewTemplate from './executiveOverviewTemplate.json';
import salesMarketingTemplate from './salesMarketingTemplate.json';
import financialPerformanceTemplate from './financialPerformanceTemplate.json';
import operationalDashboardTemplate from './operationalDashboardTemplate.json';

/**
 * Dashboard template metadata with additional information about each template
 */
export const dashboardTemplates = [
  {
    id: 'executive-overview',
    name: 'Executive Overview Dashboard',
    description: 'A high-level dashboard for executives to monitor key business metrics at a glance',
    template: executiveOverviewTemplate,
    previewImage: '/assets/templates/executive-overview-preview.png',
    tags: ['executive', 'overview', 'kpi', 'performance'],
    industry: ['all', 'general'],
    complexity: 'medium',
    dataRequirements: [
      'Revenue data over time',
      'Customer metrics',
      'Profit margin data',
      'Regional performance data'
    ],
    bestFor: 'C-level executives, managers seeking high-level business performance insights'
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing Dashboard',
    description: 'A comprehensive dashboard for tracking sales performance and marketing effectiveness',
    template: salesMarketingTemplate,
    previewImage: '/assets/templates/sales-marketing-preview.png',
    tags: ['sales', 'marketing', 'conversion', 'campaigns', 'channels'],
    industry: ['retail', 'ecommerce', 'saas', 'b2b', 'b2c'],
    complexity: 'medium',
    dataRequirements: [
      'Sales data by channel and product',
      'Conversion metrics',
      'Customer acquisition cost data',
      'Lifetime value metrics'
    ],
    bestFor: 'Sales directors, marketing managers, growth teams'
  },
  {
    id: 'financial-performance',
    name: 'Financial Performance Dashboard',
    description: 'A detailed dashboard for monitoring financial metrics and budget performance',
    template: financialPerformanceTemplate,
    previewImage: '/assets/templates/financial-performance-preview.png',
    tags: ['finance', 'budget', 'costs', 'revenue', 'expenses'],
    industry: ['all', 'finance', 'accounting'],
    complexity: 'high',
    dataRequirements: [
      'Revenue and expense data over time',
      'Cost structure breakdown',
      'Budget vs actual data',
      'Profit margin data'
    ],
    bestFor: 'CFOs, financial analysts, accounting teams'
  },
  {
    id: 'operational-dashboard',
    name: 'Operational Dashboard',
    description: 'A comprehensive dashboard for monitoring operational efficiency, quality, and team performance',
    template: operationalDashboardTemplate,
    previewImage: '/assets/templates/operational-dashboard-preview.png',
    tags: ['operations', 'efficiency', 'quality', 'production', 'team performance'],
    industry: ['manufacturing', 'logistics', 'supply chain', 'production'],
    complexity: 'high',
    dataRequirements: [
      'Production schedule data',
      'Quality metrics over time',
      'Team performance statistics',
      'Process efficiency metrics'
    ],
    bestFor: 'Operations managers, production supervisors, quality assurance teams'
  }
];

/**
 * Get a dashboard template by ID
 */
export function getTemplateById(id: string) {
  return dashboardTemplates.find(template => template.id === id);
}

/**
 * Get templates filtered by industry
 */
export function getTemplatesByIndustry(industry: string) {
  return dashboardTemplates.filter(template => 
    template.industry.includes(industry) || template.industry.includes('all')
  );
}

/**
 * Get templates filtered by complexity
 */
export function getTemplatesByComplexity(complexity: 'low' | 'medium' | 'high') {
  return dashboardTemplates.filter(template => template.complexity === complexity);
}

/**
 * Get templates filtered by tag
 */
export function getTemplatesByTag(tag: string) {
  return dashboardTemplates.filter(template => 
    template.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export default dashboardTemplates; 