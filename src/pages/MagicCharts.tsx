import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ChartRenderer } from '../components/magic/ChartRenderer';
import { ChartConfig } from '../lib/types/magicChart';
import { FileDown, RefreshCw } from 'lucide-react';

export default function MagicCharts() {
  const [configs, setConfigs] = useState<ChartConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartConfigs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://1374-191-23-82-122.ngrok-free.app/inteligence/dummy_charts', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API did not return JSON. Got: ' + contentType);
      }

      const data = await response.json();
      
      if (!Array.isArray(data.charts)) {
        throw new Error('Invalid API response format. Expected "charts" array.');
      }

      setConfigs(data.charts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart configurations';
      setError(errorMessage);
      console.error('Error fetching chart configurations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartConfigs();
  }, []);

  const handleRefresh = () => {
    fetchChartConfigs();
  };

  const generateDocumentation = () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Chart Configuration Schema",
      description: "Schema for configuring dynamic charts",
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      type: "object",
      required: ["charts"],
      properties: {
        charts: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "type", "data"],
            properties: {
              id: {
                type: "string",
                description: "Unique identifier for the chart"
              },
              type: {
                type: "string",
                enum: ["line", "area", "bar", "pie", "radar", "scatter", "matrix", "treemap", "gauge", "boxplot", "gantt", "waterfall"],
                description: "Type of chart to render"
              },
              title: {
                type: "string",
                description: "Chart title"
              },
              description: {
                type: "string",
                description: "Chart description"
              },
              data: {
                type: "array",
                description: "Chart data (format depends on chart type)"
              },
              series: {
                type: "array",
                items: {
                  type: "object",
                  required: ["key", "color", "name"],
                  properties: {
                    key: {
                      type: "string",
                      description: "Data key to plot"
                    },
                    color: {
                      type: "string",
                      description: "Color for this series (hex code)"
                    },
                    name: {
                      type: "string",
                      description: "Display name for this series"
                    }
                  }
                }
              },
              options: {
                type: "object",
                description: "Chart-specific options and base chart props",
                properties: {
                  width: {
                    type: ["number", "string"],
                    description: "Chart width"
                  },
                  height: {
                    type: ["number", "string"],
                    description: "Chart height"
                  },
                  margin: {
                    type: "object",
                    properties: {
                      top: { type: "number" },
                      right: { type: "number" },
                      bottom: { type: "number" },
                      left: { type: "number" }
                    }
                  },
                  xAxis: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      tickFormat: { type: "string", description: "Function string to format tick values" },
                      tickRotation: { type: "number" },
                      hideGridLines: { type: "boolean" },
                      min: { type: "number" },
                      max: { type: "number" }
                    }
                  },
                  yAxis: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      tickFormat: { type: "string", description: "Function string to format tick values" },
                      tickRotation: { type: "number" },
                      hideGridLines: { type: "boolean" },
                      min: { type: "number" },
                      max: { type: "number" }
                    }
                  },
                  colors: {
                    type: "object",
                    properties: {
                      scheme: { type: "string" },
                      type: { type: "string", enum: ["sequential", "diverging", "categorical"] }
                    }
                  },
                  theme: {
                    type: "string",
                    enum: ["light", "dark"]
                  },
                  enableGridX: { type: "boolean" },
                  enableGridY: { type: "boolean" },
                  enableLegend: { type: "boolean" },
                  enableTooltip: { type: "boolean" },
                  animate: { type: "boolean" },
                  motionConfig: {
                    type: "string",
                    enum: ["default", "gentle", "wobbly", "stiff"]
                  },
                  legendPosition: {
                    type: "string",
                    enum: ["top", "right", "bottom", "left"]
                  },
                  tooltipFormat: {
                    type: "string",
                    description: "Function string to format tooltip values"
                  }
                }
              }
            }
          }
        }
      },
      definitions: {
        lineChart: {
          type: "object",
          properties: {
            showDots: { type: "boolean" },
            smoothCurve: { type: "boolean" }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["name"],
              additionalProperties: { type: "number" }
            },
            example: [
              { name: "Jan", value1: 100, value2: 200 }
            ]
          }
        },
        areaChart: {
          type: "object",
          properties: {
            stacked: { type: "boolean" },
            curve: { type: "string", enum: ["linear", "monotone", "step", "stepBefore", "stepAfter"] }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["name"],
              additionalProperties: { type: "number" }
            }
          }
        },
        barChart: {
          type: "object",
          properties: {
            layout: { type: "string", enum: ["vertical", "horizontal"] },
            barSize: { type: "number" },
            stackOffset: { type: "string", enum: ["none", "expand", "wiggle", "silhouette"] }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["name"],
              additionalProperties: { type: "number" }
            }
          }
        },
        pieChart: {
          type: "object",
          properties: {
            donut: { type: "boolean" },
            padAngle: { type: "number" },
            cornerRadius: { type: "number" },
            sortByValue: { type: "boolean" },
            innerRadius: { type: "number" },
            activeOuterRadiusOffset: { type: "number" }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "value"],
              properties: {
                id: { type: "string" },
                value: { type: "number" },
                label: { type: "string" }
              }
            }
          }
        },
        radarChart: {
          type: "object",
          properties: {
            keys: { type: "array", items: { type: "string" } },
            indexBy: { type: "string" },
            maxValue: { type: ["number", "string"] },
            curve: { type: "string", enum: ["linear", "catmullRom"] },
            gridLevels: { type: "number" },
            gridShape: { type: "string", enum: ["circular", "linear"] },
            dotSize: { type: "number" },
            dotBorderWidth: { type: "number" },
            blendMode: { type: "string" }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["metric"],
              additionalProperties: { type: "number" }
            }
          }
        },
        scatterChart: {
          type: "object",
          properties: {
            bubbleSize: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" }
              }
            }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "data"],
              properties: {
                name: { type: "string" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["x", "y"],
                    properties: {
                      x: { type: "number" },
                      y: { type: "number" },
                      z: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        },
        matrixChart: {
          type: "object",
          properties: {
            xLegend: { type: "string" },
            yLegend: { type: "string" },
            sizeVariation: { type: "number" },
            forceSquare: { type: "boolean" },
            padding: { type: "number" },
            cellOpacity: { type: "number" }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "data"],
              properties: {
                id: { type: "string" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["x", "y"],
                    properties: {
                      x: { type: "string" },
                      y: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        },
        treemapChart: {
          type: "object",
          properties: {
            valueFormat: { type: "string" },
            labelSkipSize: { type: "number" },
            enableParentLabel: { type: "boolean" },
            parentLabelSize: { type: "number" },
            parentLabelPosition: { type: "string", enum: ["top", "center", "bottom"] },
            colorMode: { type: "string", enum: ["parentInherit", "gradient"] }
          },
          dataFormat: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string" },
              value: { type: "number" },
              children: { type: "array", items: { $ref: "#/definitions/treemapChart/dataFormat" } }
            }
          }
        },
        gaugeChart: {
          type: "object",
          properties: {
            value: { type: "number" },
            min: { type: "number" },
            max: { type: "number" },
            format: { type: "string", description: "Function string to format values" },
            colorScheme: {
              type: "object",
              properties: {
                low: { type: "string" },
                medium: { type: "string" },
                high: { type: "string" }
              }
            }
          }
        },
        boxPlotChart: {
          type: "object",
          properties: {
            color: { type: "string" }
          },
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "min", "q1", "median", "q3", "max"],
              properties: {
                name: { type: "string" },
                min: { type: "number" },
                q1: { type: "number" },
                median: { type: "number" },
                q3: { type: "number" },
                max: { type: "number" }
              }
            }
          }
        },
        ganttChart: {
          type: "object",
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "name", "start", "end", "progress"],
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                start: { type: "string", format: "date-time" },
                end: { type: "string", format: "date-time" },
                progress: { type: "number" },
                dependencies: { type: "array", items: { type: "string" } }
              }
            }
          }
        },
        waterfallChart: {
          type: "object",
          dataFormat: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "value"],
              properties: {
                name: { type: "string" },
                value: { type: "number" },
                isTotal: { type: "boolean" }
              }
            }
          }
        }
      },
      examples: [
        {
          charts: [
            {
              id: "revenue-growth",
              type: "line",
              title: "Revenue Growth",
              description: "Monthly revenue trends",
              data: [
                { name: "Jan", value: 1000 },
                { name: "Feb", value: 1200 }
              ],
              series: [
                {
                  key: "value",
                  name: "Revenue",
                  color: "#8884d8"
                }
              ],
              options: {
                showDots: true,
                smoothCurve: true,
                xAxis: { title: "Month" },
                yAxis: { title: "Revenue ($)" },
                enableGridX: true,
                enableGridY: true,
                theme: "light"
              }
            }
          ]
        }
      ]
    };

    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Magic Charts"
        description="AI-powered dynamic chart generation"
        actions={
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Charts
            </button>
            <button
              onClick={generateDocumentation}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Schema
            </button>
          </div>
        }
      />

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure the API endpoint is accessible and CORS is properly configured.
          </p>
        </div>
      )}

      {!isLoading && !error && configs.length === 0 && (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No charts available
          </h3>
          <p className="text-gray-500 mb-4">
            No chart configurations were returned from the API. Try refreshing or check the API endpoint.
          </p>
        </div>
      )}

      {!isLoading && !error && configs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {configs.map((config) => (
            <ChartRenderer key={config.id} config={config} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}