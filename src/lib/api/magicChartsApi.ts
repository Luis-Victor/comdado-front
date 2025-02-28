import { 
  DashboardConfigResponse, 
  ChartsCountResponse, 
  ChartDataResponse, 
  CombinedDashboardResponse,
  ApiErrorResponse
} from '../types/api';

// API endpoints
const API_BASE_URL = 'https://67fb-191-9-15-212.ngrok-free.app';
const DASHBOARD_CONFIG_ENDPOINT = `${API_BASE_URL}/inteligence/dashboard_config`;
const CHARTS_COUNT_ENDPOINT = `${API_BASE_URL}/inteligence/charts_count`;
const CHART_DATA_ENDPOINT = `${API_BASE_URL}/inteligence/chart_data`;
const COMBINED_ENDPOINT = `${API_BASE_URL}/inteligence/dummy_charts`;

// Common headers for all API requests
const API_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': '69420'
};

/**
 * Fetches dashboard configuration from the API
 */
export async function fetchDashboardConfig(): Promise<DashboardConfigResponse> {
  try {
    const response = await fetch(DASHBOARD_CONFIG_ENDPOINT, {
      method: 'GET',
      headers: API_HEADERS,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json() as DashboardConfigResponse;
  } catch (error) {
    console.error('Error fetching dashboard configuration:', error);
    throw error;
  }
}

/**
 * Fetches chart count and IDs from the API
 */
export async function fetchChartsCount(): Promise<ChartsCountResponse> {
  try {
    const response = await fetch(CHARTS_COUNT_ENDPOINT, {
      method: 'GET',
      headers: API_HEADERS,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json() as ChartsCountResponse;
  } catch (error) {
    console.error('Error fetching charts count:', error);
    throw error;
  }
}

/**
 * Fetches data for a specific chart by ID
 */
export async function fetchChartData(chartId: string): Promise<ChartDataResponse> {
  try {
    const response = await fetch(`${CHART_DATA_ENDPOINT}/${chartId}`, {
      method: 'GET',
      headers: API_HEADERS,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json() as ChartDataResponse;
  } catch (error) {
    console.error(`Error fetching chart data for ${chartId}:`, error);
    throw error;
  }
}

/**
 * Fetches all dashboard data in a single request (combined endpoint)
 */
export async function fetchCombinedDashboard(): Promise<CombinedDashboardResponse> {
  try {
    const response = await fetch(COMBINED_ENDPOINT, {
      method: 'GET',
      headers: API_HEADERS,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the current dummy_charts endpoint which returns an array
    if (Array.isArray(data)) {
      // Transform the array into the expected combined response format
      return {
        title: "Performance Overview",
        theme: "light",
        layout: {
          rows: 12,
          columns: 12,
          gap: 16,
          rowHeight: "auto",
          responsive: {
            breakpoints: {
              sm: 576,
              md: 768,
              lg: 992,
              xl: 1200
            },
            behavior: "reflow",
            columnThreshold: {
              sm: 4,
              md: 6,
              lg: 8,
              xl: 12
            },
            gapThreshold: {
              sm: 8,
              md: 12,
              lg: 16,
              xl: 16
            },
            priorityLevels: 3
          }
        },
        charts: data,
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: "1.0.0",
          generatedBy: "Magic Charts API"
        }
      };
    }
    
    return data as CombinedDashboardResponse;
  } catch (error) {
    console.error('Error fetching combined dashboard data:', error);
    throw error;
  }
}

/**
 * Utility function to convert a combined response to dashboard config format
 */
export function convertToDashboardConfig(response: CombinedDashboardResponse) {
  return {
    title: response.title,
    theme: response.theme,
    layout: response.layout,
    components: response.charts
  };
}