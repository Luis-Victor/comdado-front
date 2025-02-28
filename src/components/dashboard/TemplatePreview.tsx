import React, { useState } from 'react';
import { DashboardConfig } from '../../lib/types/dashboard';

interface TemplatePreviewProps {
  config: DashboardConfig;
  onCustomizationComplete: (config: DashboardConfig) => void;
  onBack: () => void;
}

export default function TemplatePreview({ 
  config, 
  onCustomizationComplete, 
  onBack 
}: TemplatePreviewProps) {
  const [customizedConfig, setCustomizedConfig] = useState<DashboardConfig>(config);
  const [activeTab, setActiveTab] = useState<'layout' | 'components' | 'theme'>('layout');

  // Handle theme changes
  const handleThemeChange = (theme: string) => {
    setCustomizedConfig(prev => ({
      ...prev,
      theme
    }));
  };

  // Handle layout changes
  const handleLayoutChange = (field: string, value: any) => {
    setCustomizedConfig(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [field]: value
      }
    }));
  };

  // Handle adding a component
  const handleAddComponent = () => {
    // This is a simplified implementation - in a real app, you'd have a component selector
    const newComponent = {
      id: `component-${Date.now()}`,
      type: 'Card',
      title: 'New Component',
      x: 0,
      y: customizedConfig.components.length,
      w: 1,
      h: 1,
      content: {
        type: 'text',
        text: 'New component content'
      }
    };

    setCustomizedConfig(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  };

  // Handle removing a component
  const handleRemoveComponent = (componentId: string) => {
    setCustomizedConfig(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId)
    }));
  };

  // Handle editing a component
  const handleEditComponent = (componentId: string, field: string, value: any) => {
    setCustomizedConfig(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === componentId ? { ...comp, [field]: value } : comp
      )
    }));
  };

  return (
    <div className="template-preview">
      <div className="template-preview-tabs">
        <button 
          className={`tab ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          Layout
        </button>
        <button 
          className={`tab ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button 
          className={`tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          Theme
        </button>
      </div>

      <div className="template-preview-content">
        {activeTab === 'layout' && (
          <div className="layout-customization">
            <h3>Layout Settings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="rows">Rows</label>
                <input 
                  type="number" 
                  id="rows"
                  value={customizedConfig.layout.rows}
                  onChange={(e) => handleLayoutChange('rows', parseInt(e.target.value, 10))}
                  min={1}
                  max={20}
                />
              </div>
              <div className="form-group">
                <label htmlFor="columns">Columns</label>
                <input 
                  type="number" 
                  id="columns"
                  value={customizedConfig.layout.columns}
                  onChange={(e) => handleLayoutChange('columns', parseInt(e.target.value, 10))}
                  min={1}
                  max={12}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gap">Gap (px)</label>
                <input 
                  type="number" 
                  id="gap"
                  value={customizedConfig.layout.gap}
                  onChange={(e) => handleLayoutChange('gap', parseInt(e.target.value, 10))}
                  min={0}
                  max={50}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rowHeight">Row Height (px)</label>
                <input 
                  type="number" 
                  id="rowHeight"
                  value={customizedConfig.layout.rowHeight}
                  onChange={(e) => handleLayoutChange('rowHeight', parseInt(e.target.value, 10))}
                  min={50}
                  max={500}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="components-customization">
            <h3>Components</h3>
            <button 
              className="add-component-btn"
              onClick={handleAddComponent}
            >
              Add Component
            </button>
            
            <div className="components-list">
              {customizedConfig.components.map((component, index) => (
                <div key={component.id} className="component-item">
                  <div className="component-header">
                    <span>{component.title || `Component ${index + 1}`}</span>
                    <button 
                      className="remove-component-btn"
                      onClick={() => handleRemoveComponent(component.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="component-form">
                    <div className="form-group">
                      <label>Title</label>
                      <input 
                        type="text"
                        value={component.title || ''}
                        onChange={(e) => handleEditComponent(component.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Width (columns)</label>
                      <input 
                        type="number"
                        value={component.w}
                        onChange={(e) => handleEditComponent(component.id, 'w', parseInt(e.target.value, 10))}
                        min={1}
                        max={customizedConfig.layout.columns}
                      />
                    </div>
                    <div className="form-group">
                      <label>Height (rows)</label>
                      <input 
                        type="number"
                        value={component.h}
                        onChange={(e) => handleEditComponent(component.id, 'h', parseInt(e.target.value, 10))}
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="theme-customization">
            <h3>Theme Settings</h3>
            <div className="theme-options">
              <button 
                className={`theme-option ${customizedConfig.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                Light
              </button>
              <button 
                className={`theme-option ${customizedConfig.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </button>
              <button 
                className={`theme-option ${customizedConfig.theme === 'blue' ? 'active' : ''}`}
                onClick={() => handleThemeChange('blue')}
              >
                Blue
              </button>
              <button 
                className={`theme-option ${customizedConfig.theme === 'green' ? 'active' : ''}`}
                onClick={() => handleThemeChange('green')}
              >
                Green
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="preview-dashboard">
        <h3>Dashboard Preview</h3>
        <div className="dashboard-preview-container" style={{ 
          backgroundColor: customizedConfig.theme === 'dark' ? '#1a1a1a' : 
                            customizedConfig.theme === 'blue' ? '#f0f4f8' : 
                            customizedConfig.theme === 'green' ? '#f0f8f5' : '#ffffff'
        }}>
          <div className="preview-grid" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${customizedConfig.layout.columns}, 1fr)`,
            gridGap: `${customizedConfig.layout.gap}px`,
            padding: '20px'
          }}>
            {customizedConfig.components.map(component => (
              <div 
                key={component.id}
                className="preview-component"
                style={{
                  gridColumn: `span ${component.w}`,
                  gridRow: `span ${component.h}`,
                  backgroundColor: customizedConfig.theme === 'dark' ? '#333' : 
                                   customizedConfig.theme === 'blue' ? '#dbeafe' : 
                                   customizedConfig.theme === 'green' ? '#d1fae5' : '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h4 style={{ 
                  color: customizedConfig.theme === 'dark' ? '#fff' : '#333',
                  marginBottom: '8px'
                }}>
                  {component.title || 'Untitled Component'}
                </h4>
                <div className="component-preview-placeholder" style={{
                  height: '100px',
                  backgroundColor: customizedConfig.theme === 'dark' ? '#444' : 
                                    customizedConfig.theme === 'blue' ? '#bfdbfe' : 
                                    customizedConfig.theme === 'green' ? '#a7f3d0' : '#f3f4f6',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: customizedConfig.theme === 'dark' ? '#ccc' : '#666'
                }}>
                  {component.type} Content
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="template-preview-actions">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          Back to Templates
        </button>
        <button 
          className="complete-btn"
          onClick={() => onCustomizationComplete(customizedConfig)}
        >
          Continue with this Configuration
        </button>
      </div>
    </div>
  );
} 