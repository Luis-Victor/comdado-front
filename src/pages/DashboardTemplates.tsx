import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateCard } from '../components/templates/TemplateCard';
import { TemplateFilterBar } from '../components/templates/TemplateFilterBar';
import { TemplateSelectorModal } from '../components/templates/TemplateSelectorModal';

// Import templates and template selector utility
import {
  allTemplates,
  executiveOverviewTemplate,
  salesMarketingTemplate,
  financialPerformanceTemplate,
  operationalDashboardTemplate
} from '../lib/config/templates';
import { scoreTemplateForBusiness } from '../lib/config/templates/templateSelector';

// Add proper interface for templates
interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  industry: string | string[];
  complexity: string;
  tags: string[];
  dataRequirements: string[];
  bestFor: string[];
  config: any;
  [key: string]: any;
}

export function DashboardTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(allTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [dataPoints, setDataPoints] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<(Template & { score?: number })[]>([]);

  // When business type and data points change, update recommendations
  useEffect(() => {
    if (businessType && dataPoints.length > 0) {
      const scoredTemplates = allTemplates.map(template => ({
        ...template,
        score: scoreTemplateForBusiness(template, businessType, dataPoints)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
      
      setRecommendations(scoredTemplates);
    } else {
      setRecommendations([]);
    }
  }, [businessType, dataPoints]);

  const handleFilter = (filters: { industry?: string; complexity?: string; tags?: string[] }) => {
    let filteredTemplates = [...allTemplates];
    
    if (filters.industry && filters.industry !== 'all') {
      filteredTemplates = filteredTemplates.filter(template => {
        if (Array.isArray(template.industry)) {
          return template.industry.includes(filters.industry as string);
        }
        return template.industry === filters.industry;
      });
    }
    
    if (filters.complexity) {
      filteredTemplates = filteredTemplates.filter(
        template => template.complexity === filters.complexity
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredTemplates = filteredTemplates.filter(template =>
        filters.tags!.some(tag => template.tags.includes(tag))
      );
    }
    
    setTemplates(filteredTemplates);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleUseTemplate = (customizationOptions: {
    name: string;
    description: string;
    isPublic: boolean;
    tags: string[];
  }) => {
    if (!selectedTemplate) return;
    
    // Clone the template configuration and apply customizations
    const dashboardConfig = {
      ...selectedTemplate.config,
      id: `dashboard-${Date.now()}`,
      name: customizationOptions.name,
      description: customizationOptions.description,
      isPublic: customizationOptions.isPublic,
      tags: customizationOptions.tags,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    // Store the dashboard configuration
    const dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
    dashboards.push(dashboardConfig);
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
    
    // Close the modal and navigate to the new dashboard
    setShowModal(false);
    navigate(`/dashboard/${dashboardConfig.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Templates</h1>
        <p className="mt-2 text-gray-600">
          Choose from our pre-built templates to quickly create dashboards for your specific business needs.
        </p>
      </div>
      
      <TemplateFilterBar onFilter={handleFilter} />
      
      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recommended for Your Business</h2>
          <p className="mt-1 text-sm text-gray-500">
            Based on your business type and available data.
          </p>
          
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((template) => (
              <div key={template.id} className="relative">
                {(template.score || 0) > 80 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Best Match
                    </span>
                  </div>
                )}
                <TemplateCard
                  template={template}
                  onSelect={() => handleTemplateSelect(template)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">All Templates</h2>
        
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => handleTemplateSelect(template)}
            />
          ))}
          
          {templates.length === 0 && (
            <div className="col-span-3 py-12 text-center">
              <p className="text-gray-500">No templates match your current filters. Try adjusting your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedTemplate && (
        <TemplateSelectorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUseTemplate={handleUseTemplate}
          template={selectedTemplate}
        />
      )}
    </div>
  );
} 