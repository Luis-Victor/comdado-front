import { DashboardComponentSizes } from '../types/dashboard';

export const componentSizes: DashboardComponentSizes = {
  description: "Component size definitions for the dashboard",
  visualizationComponents: [
    {
      type: "Card",
      description: "KPI and information cards",
      sizes: {
        minimum: { width: 1, height: 1 },
        recommended: { width: 3, height: 1 },
        pixelMinimum: { width: 160, height: 80 }
      }
    },
    {
      type: "LineChart",
      description: "Time series visualization",
      sizes: {
        minimum: { width: 4, height: 2 },
        recommended: { width: 6, height: 2 },
        large: { width: 8, height: 3 },
        pixelMinimum: { width: 400, height: 200 }
      }
    },
    // ... other visualization components
  ],
  filterComponents: [
    {
      type: "DatePicker",
      sizes: {
        minimum: { width: 2, height: 1 },
        recommended: { width: 2, height: 1 },
        pixelMinimum: { width: 180, height: 60 }
      }
    },
    // ... other filter components
  ],
  gridRecommendations: {
    columnsRange: {
      minimum: 6,
      recommended: 12,
      maximum: 24
    },
    rowsRange: {
      minimum: 4,
      recommended: 6,
      maximum: 12
    },
    gapRange: {
      minimum: 8,
      recommended: 16,
      maximum: 24
    }
  }
};