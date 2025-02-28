import React, { useState } from 'react';
import { Settings, Save, FileDown, Upload, Trash2 } from 'lucide-react';
import { DashboardConfig } from '../../lib/types/dashboard';

interface DashboardManagerProps {
  config: DashboardConfig;
  onSave: (config: DashboardConfig) => void;
  onClose: () => void;
}

export function DashboardManager({ config, onSave, onClose }: DashboardManagerProps) {
  const [configJson, setConfigJson] = useState<string>(JSON.stringify(config, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'json' | 'visual'>('json');

  const handleSave = () => {
    try {
      const newConfig = JSON.parse(configJson);
      
      // Basic validation
      if (!newConfig.title || !newConfig.layout || !newConfig.components) {
        throw new Error('Invalid configuration: missing required fields (title, layout, or components)');
      }
      
      onSave(newConfig);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleExport = () => {
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Validate JSON before setting
        JSON.parse(content);
        setConfigJson(content);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to the original configuration?')) {
      setConfigJson(JSON.stringify(config, null, 2));
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Configuration</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'json'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('json')}
            >
              JSON Editor
            </button>
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'visual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('visual')}
            >
              Visual Editor
            </button>
          </nav>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          {activeTab === 'json' && (
            <textarea
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              className="w-full h-[60vh] font-mono text-sm p-4 border border-gray-300 rounded-md"
              spellCheck="false"
            />
          )}
          
          {activeTab === 'visual' && (
            <div className="p-4 text-center text-gray-500">
              <p>Visual editor is coming soon!</p>
              <p className="text-sm mt-2">For now, please use the JSON editor to modify your dashboard configuration.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}