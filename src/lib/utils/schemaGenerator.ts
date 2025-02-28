/**
 * Utility for generating JSON schemas from API responses
 */

import { saveAs } from 'file-saver';

/**
 * Generates a JSON schema from an example object
 * @param example The example object to generate a schema from
 * @param title Schema title
 * @param description Schema description
 */
export function generateSchema(
  example: any, 
  title: string = 'Generated Schema',
  description: string = 'Automatically generated schema from example data'
): object {
  const schema: any = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title,
    description,
    type: getType(example),
  };

  if (schema.type === 'object') {
    schema.properties = {};
    schema.required = [];

    for (const [key, value] of Object.entries(example)) {
      schema.properties[key] = generateSchemaForValue(value);
      schema.required.push(key);
    }
  } else if (schema.type === 'array' && example.length > 0) {
    schema.items = generateSchemaForValue(example[0]);
  }

  return schema;
}

/**
 * Generates a schema for a specific value
 */
function generateSchemaForValue(value: any): any {
  const type = getType(value);
  const schema: any = { type };

  if (type === 'object') {
    schema.properties = {};
    schema.required = [];

    for (const [key, propValue] of Object.entries(value)) {
      schema.properties[key] = generateSchemaForValue(propValue);
      schema.required.push(key);
    }
  } else if (type === 'array' && value.length > 0) {
    schema.items = generateSchemaForValue(value[0]);
  }

  return schema;
}

/**
 * Gets the JSON Schema type for a value
 */
function getType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  
  const type = typeof value;
  
  // Handle special cases
  if (type === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  }
  
  return type;
}

/**
 * Saves a schema to a file
 */
export function downloadSchema(schema: object, filename: string = 'schema.json'): void {
  const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
  saveAs(blob, filename);
}

/**
 * Generates a comprehensive schema for all Magic Charts API endpoints
 */
export function generateMagicChartsSchema(
  dashboardConfig: any,
  chartsCount: any,
  chartData: any
): object {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Magic Charts API Schema",
    description: "Comprehensive schema for all Magic Charts API endpoints",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    endpoints: {
      dashboardConfig: {
        path: "/inteligence/dashboard_config",
        method: "GET",
        description: "Fetches dashboard configuration",
        responseSchema: generateSchema(dashboardConfig, "Dashboard Configuration", "Schema for dashboard configuration")
      },
      chartsCount: {
        path: "/inteligence/charts_count",
        method: "GET",
        description: "Fetches chart count and IDs",
        responseSchema: generateSchema(chartsCount, "Charts Count", "Schema for charts count and IDs")
      },
      chartData: {
        path: "/inteligence/chart_data/{chartId}",
        method: "GET",
        description: "Fetches data for a specific chart",
        parameters: [
          {
            name: "chartId",
            in: "path",
            required: true,
            description: "ID of the chart to fetch",
            schema: {
              type: "string"
            }
          }
        ],
        responseSchema: generateSchema(chartData, "Chart Data", "Schema for individual chart data")
      },
      combinedDashboard: {
        path: "/inteligence/dummy_charts",
        method: "GET",
        description: "Fetches all dashboard data in a single request",
        responseSchema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: "Combined Dashboard Response",
          description: "Schema for the combined dashboard response",
          type: "object",
          required: ["title", "theme", "layout", "charts"],
          properties: {
            title: {
              type: "string",
              description: "Dashboard title"
            },
            theme: {
              type: "string",
              enum: ["light", "dark"],
              description: "Dashboard theme"
            },
            layout: generateSchema(dashboardConfig.layout, "Layout", "Dashboard layout configuration").properties.layout,
            charts: {
              type: "array",
              items: generateSchema(chartData, "Chart", "Chart component configuration"),
              description: "Array of chart components"
            },
            metadata: {
              type: "object",
              description: "Optional metadata about the dashboard",
              properties: {
                lastUpdated: {
                  type: "string",
                  format: "date-time",
                  description: "When the dashboard was last updated"
                },
                version: {
                  type: "string",
                  description: "Dashboard version"
                },
                generatedBy: {
                  type: "string",
                  description: "Information about what generated the dashboard"
                }
              }
            }
          }
        }
      }
    }
  };
}