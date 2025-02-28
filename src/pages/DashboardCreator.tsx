import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import TemplateSelector from '../components/dashboard/TemplateSelector';
import TemplatePreview from '../components/dashboard/TemplatePreview';
import { getTemplateById } from '../lib/config/templates';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DashboardCreator() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [customizedConfig, setCustomizedConfig] = useState<any>(null);
  const [creationStep, setCreationStep] = useState<'select' | 'customize' | 'configure'>('select');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for template ID in URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const templateId = searchParams.get('template');
    
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedTemplateId(templateId);
        // Create a deep copy of the template for customization
        setCustomizedConfig(JSON.parse(JSON.stringify(template.template)));
        setCreationStep('customize');
        
        // Clear the URL parameter after loading the template
        navigate('/dashboard/create', { replace: true });
      }
    }
  }, [location.search, navigate]);
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = getTemplateById(templateId);
    if (template) {
      // Create a deep copy of the template for customization
      setCustomizedConfig(JSON.parse(JSON.stringify(template.template)));
      setCreationStep('customize');
    }
  };
  
  const handleCustomizationComplete = (config: any) => {
    setCustomizedConfig(config);
    setCreationStep('configure');
  };
  
  const handleConfigurationComplete = (finalConfig: any) => {
    // Here you would save the dashboard configuration to your backend
    console.log('Saving dashboard:', finalConfig);
    
    // For now, we'll just redirect to the dashboard page
    // In a real implementation, you might save the config to a database and redirect to the new dashboard
    navigate('/dashboard');
  };
  
  const handleBackToTemplates = () => {
    setCreationStep('select');
    setSelectedTemplateId(null);
    setCustomizedConfig(null);
  };
  
  return (
    <DashboardLayout>
      <div className="dashboard-creator">
        <div className="page-header mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {creationStep === 'select' ? 'Choose a Dashboard Template' : 
             creationStep === 'customize' ? 'Customize Your Dashboard' :
             'Configure Data Sources'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {creationStep === 'select' ? 'Select a template that matches your business needs or get personalized recommendations.' : 
             creationStep === 'customize' ? 'Customize the layout and components of your dashboard.' :
             'Connect your dashboard to data sources.'}
          </p>
        </div>
        
        {/* Creation Steps Indicator */}
        <div className="creation-steps mb-8">
          <ol className="flex items-center">
            <li className={`flex items-center ${creationStep === 'select' ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                creationStep === 'select' ? 'bg-blue-100 text-blue-600' : 
                creationStep === 'customize' || creationStep === 'configure' ? 'bg-green-100 text-green-600' : 'bg-gray-200'
              }`}>
                1
              </span>
              <span className="ml-2 text-sm font-medium">Select Template</span>
              <div className="flex-1 w-12 h-1 mx-2 bg-gray-200"></div>
            </li>
            <li className={`flex items-center ${creationStep === 'customize' ? 'text-blue-600' : creationStep === 'configure' ? 'text-green-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                creationStep === 'customize' ? 'bg-blue-100 text-blue-600' : 
                creationStep === 'configure' ? 'bg-green-100 text-green-600' : 'bg-gray-200'
              }`}>
                2
              </span>
              <span className="ml-2 text-sm font-medium">Customize</span>
              <div className="flex-1 w-12 h-1 mx-2 bg-gray-200"></div>
            </li>
            <li className={`flex items-center ${creationStep === 'configure' ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                creationStep === 'configure' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'
              }`}>
                3
              </span>
              <span className="ml-2 text-sm font-medium">Configure Data</span>
            </li>
          </ol>
        </div>
        
        {creationStep === 'select' && (
          <TemplateSelector onSelectTemplate={handleTemplateSelect} />
        )}
        
        {creationStep === 'customize' && customizedConfig && (
          <TemplatePreview 
            config={customizedConfig} 
            onCustomizationComplete={handleCustomizationComplete}
            onBack={handleBackToTemplates}
          />
        )}
        
        {creationStep === 'configure' && customizedConfig && (
          <div className="data-configuration">
            <h2 className="text-lg font-semibold mb-4">Configure Data Sources</h2>
            <p className="text-gray-500 mb-6">
              Connect your dashboard components to data sources. This step is simplified for the demo.
            </p>
            
            <div className="components-list space-y-4">
              {customizedConfig.components.map((component: any) => (
                <div key={component.id} className="component-config p-4 border rounded-md">
                  <h3 className="font-medium">{component.title || `Component ${component.id}`}</h3>
                  <p className="text-sm text-gray-500">Type: {component.type}</p>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Data Source
                    </label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      <option>Sample Data</option>
                      <option>CSV Upload</option>
                      <option>API Connection</option>
                      <option>Database Query</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setCreationStep('customize')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Customization
              </button>
              <button 
                onClick={() => handleConfigurationComplete(customizedConfig)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 