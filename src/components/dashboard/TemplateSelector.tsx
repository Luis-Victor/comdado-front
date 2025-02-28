import React, { useState } from 'react';
import { dashboardTemplates } from '../../lib/config/templates';
import { 
  recommendTemplates,
  BusinessType, 
  BusinessSize, 
  DashboardPurpose, 
  DataCategory,
  TemplateSelectionInput
} from '../../lib/utils/templateSelector';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<'browse' | 'recommend'>('browse');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [formData, setFormData] = useState<TemplateSelectionInput>({
    businessType: 'retail' as BusinessType,
    businessSize: 'medium' as BusinessSize,
    dashboardPurpose: 'executive-overview' as DashboardPurpose,
    availableDataCategories: ['revenue', 'customers', 'sales'] as DataCategory[],
    audienceRole: 'executive'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDataCategoryChange = (category: DataCategory, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          availableDataCategories: [...prev.availableDataCategories, category]
        };
      } else {
        return {
          ...prev,
          availableDataCategories: prev.availableDataCategories.filter(cat => cat !== category)
        };
      }
    });
  };

  const handleRecommendationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const results = recommendTemplates(formData);
    setRecommendations(results);
  };

  // Available data categories for the form
  const allDataCategories: DataCategory[] = [
    'revenue', 'customers', 'operations', 'marketing', 
    'sales', 'finance', 'quality', 'performance', 
    'geographic', 'products', 'time-series'
  ];

  return (
    <div className="template-selector">
      <div className="selection-mode-tabs">
        <button 
          className={selectionMode === 'browse' ? 'active' : ''} 
          onClick={() => setSelectionMode('browse')}
        >
          Browse All Templates
        </button>
        <button 
          className={selectionMode === 'recommend' ? 'active' : ''} 
          onClick={() => setSelectionMode('recommend')}
        >
          Get Recommendations
        </button>
      </div>

      {selectionMode === 'browse' && (
        <div className="template-grid">
          {dashboardTemplates.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-preview">
                <img 
                  src={template.previewImage || '/assets/templates/default-preview.png'} 
                  alt={template.name} 
                />
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-tags">
                  {template.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="template-meta">
                  <span>Complexity: {template.complexity}</span>
                  <span>Best for: {template.industry.join(', ')}</span>
                </div>
                <button 
                  className="select-template-btn"
                  onClick={() => onSelectTemplate(template.id)}
                >
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectionMode === 'recommend' && (
        <div className="recommendation-container">
          {recommendations.length === 0 ? (
            <div className="recommendation-form-container">
              <h3>Tell us about your needs</h3>
              <form onSubmit={handleRecommendationSubmit} className="recommendation-form">
                <div className="form-group">
                  <label>Business Type</label>
                  <select 
                    name="businessType" 
                    value={formData.businessType}
                    onChange={handleInputChange}
                  >
                    <option value="retail">Retail</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="logistics">Logistics</option>
                    <option value="professional-services">Professional Services</option>
                    <option value="education">Education</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Business Size</label>
                  <select 
                    name="businessSize" 
                    value={formData.businessSize}
                    onChange={handleInputChange}
                  >
                    <option value="small">Small (1-50 employees)</option>
                    <option value="medium">Medium (51-500 employees)</option>
                    <option value="large">Large (501-5000 employees)</option>
                    <option value="enterprise">Enterprise (5000+ employees)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Dashboard Purpose</label>
                  <select 
                    name="dashboardPurpose" 
                    value={formData.dashboardPurpose}
                    onChange={handleInputChange}
                  >
                    <option value="executive-overview">Executive Overview</option>
                    <option value="sales-analysis">Sales Analysis</option>
                    <option value="marketing-performance">Marketing Performance</option>
                    <option value="financial-reporting">Financial Reporting</option>
                    <option value="operational-efficiency">Operational Efficiency</option>
                    <option value="customer-insights">Customer Insights</option>
                    <option value="product-performance">Product Performance</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Primary Audience</label>
                  <input 
                    type="text" 
                    name="audienceRole"
                    value={formData.audienceRole}
                    onChange={handleInputChange}
                    placeholder="e.g., CEO, Sales Manager, Analyst"
                  />
                </div>
                
                <div className="form-group data-categories">
                  <label>Available Data Categories</label>
                  <div className="checkbox-grid">
                    {allDataCategories.map(category => (
                      <div key={category} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={formData.availableDataCategories.includes(category)}
                          onChange={(e) => handleDataCategoryChange(category, e.target.checked)}
                        />
                        <label htmlFor={`category-${category}`}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="find-templates-btn">
                  Find Best Templates
                </button>
              </form>
            </div>
          ) : (
            <div className="recommendations-results">
              <h3>Recommended Templates</h3>
              <button 
                onClick={() => setRecommendations([])} 
                className="back-btn"
              >
                Back to Form
              </button>
              
              <div className="recommended-templates">
                {recommendations.map(rec => (
                  <div key={rec.templateId} className="recommendation-card">
                    <h3>{rec.templateName}</h3>
                    <div className="match-score">
                      Match Score: {Math.round(rec.score * 100)}%
                    </div>
                    
                    <h4>Why this template?</h4>
                    <ul className="match-reasons">
                      {rec.matchReasons.map((reason: string, i: number) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                    
                    {rec.missingDataCategories && (
                      <div className="missing-data">
                        <h4>Missing data categories:</h4>
                        <ul>
                          {rec.missingDataCategories.map((cat: string) => (
                            <li key={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => onSelectTemplate(rec.templateId)}
                      className="select-template-btn"
                    >
                      Use This Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 