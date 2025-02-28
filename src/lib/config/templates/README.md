# Dashboard Templates

This directory contains a collection of predefined dashboard templates designed to help you quickly create effective business analytical dashboards. Each template follows the dashboard configuration schema defined in `src/schemas/dashboardConfig.json`.

## Available Templates

1. **Executive Overview Dashboard** (`executiveOverviewTemplate.json`)
   - A high-level dashboard for executives to monitor key business metrics at a glance
   - Focuses on KPIs, trends, and segment breakdowns
   - Best for: C-level executives, managers seeking high-level business performance insights

2. **Sales & Marketing Dashboard** (`salesMarketingTemplate.json`)
   - A comprehensive dashboard for tracking sales performance and marketing effectiveness
   - Includes conversion funnel, channel performance, and customer segments
   - Best for: Sales directors, marketing managers, growth teams

3. **Financial Performance Dashboard** (`financialPerformanceTemplate.json`)
   - A detailed dashboard for monitoring financial metrics and budget performance
   - Features revenue vs expenses trends, cost structure, and budget comparisons
   - Best for: CFOs, financial analysts, accounting teams

4. **Operational Dashboard** (`operationalDashboardTemplate.json`)
   - A comprehensive dashboard for monitoring operational efficiency, quality, and team performance
   - Includes production timeline, process efficiency gauges, and quality metrics
   - Best for: Operations managers, production supervisors, quality assurance teams

## Template Structure

Each template is a JSON file that follows the dashboard configuration schema and includes:

- **Title and Description**: Names and describes the dashboard's purpose
- **Layout**: Grid configuration with responsive behavior
- **Components**: Chart and UI elements with position, size, and options
- **Filters**: Interactive filters that affect dashboard components

## Using Templates

Here's how to use these templates in your application:

```typescript
// Import a specific template
import { getTemplateById } from 'src/lib/config/templates';

// Get a template by ID
const template = getTemplateById('executive-overview');

// Get templates by industry
import { getTemplatesByIndustry } from 'src/lib/config/templates';
const retailTemplates = getTemplatesByIndustry('retail');

// Get templates by complexity
import { getTemplatesByComplexity } from 'src/lib/config/templates';
const simpleTemplates = getTemplatesByComplexity('low');

// Get templates by tag
import { getTemplatesByTag } from 'src/lib/config/templates';
const kpiTemplates = getTemplatesByTag('kpi');
```

### Template Selection

To help users select the most appropriate template:

1. **Consider the audience** - Who will be viewing this dashboard?
2. **Identify key metrics** - What are the most important data points to show?
3. **Assess data availability** - Do you have the data required by the template?
4. **Consider industry** - Some templates are better suited for specific industries

### Template Customization

After selecting a template, you'll typically want to customize it:

```typescript
import { getTemplateById } from 'src/lib/config/templates';

// Get the template
const template = getTemplateById('executive-overview');

// Make a copy for customization
const customizedTemplate = JSON.parse(JSON.stringify(template.template));

// Customize aspects of the template
customizedTemplate.title = 'My Executive Dashboard';
customizedTemplate.components[0].title = 'Monthly Revenue';

// Apply to your dashboard
saveDashboardConfig(customizedTemplate);
```

## Common Customizations

- **Data Sources**: Connect template components to your actual data sources
- **Metrics**: Update KPIs to show metrics relevant to your business
- **Layout**: Adjust component sizes and positions to emphasize important information
- **Visual Theme**: Customize colors and styles to match your brand
- **Filters**: Configure date ranges and filter options for your data

## Responsiveness

Templates include responsive behavior configurations for different screen sizes. Key responsive settings:

- **Breakpoints**: Screen width thresholds (sm, md, lg, xl)
- **Behavior**: How the layout reacts when screen size changes
- **Priority Levels**: Which components to show/hide at different screen sizes
- **Column/Gap Thresholds**: Adjustments at different breakpoints

## Extending Templates

To create a new template:

1. Copy an existing template as a starting point
2. Update the layout, components, and filters to match your needs
3. Add it to the templates index file with appropriate metadata
4. Create a preview image in `/assets/templates/`

## Best Practices

- **Focus on the story**: Arrange components to tell a coherent data story
- **Prioritize information**: Most important metrics should be prominent
- **Group related metrics**: Keep related information together
- **Maintain visual hierarchy**: Use size and position to indicate importance
- **Limit dashboard scope**: Don't try to show everything; focus on a specific area
- **Consider the user's workflow**: Arrange components in a logical viewing order

By leveraging these templates, you can quickly create effective dashboards that provide clients with the best vision of their data while maintaining the flexibility to customize for specific needs. 