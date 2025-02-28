import dashboardTemplates, { 
  getTemplatesByIndustry, 
  getTemplatesByTag 
} from '../config/templates';

/**
 * Template recommendation score criteria weights
 */
const CRITERIA_WEIGHTS = {
  industryMatch: 0.35,
  dataAvailability: 0.30,
  complexityMatch: 0.20,
  tagMatch: 0.15
};

/**
 * Data category types that might be available in a business
 */
export type DataCategory = 
  | 'revenue' 
  | 'customers' 
  | 'operations' 
  | 'marketing' 
  | 'sales' 
  | 'finance' 
  | 'quality' 
  | 'performance' 
  | 'geographic'
  | 'products'
  | 'time-series';

/**
 * Business type for template selection
 */
export type BusinessType = 
  | 'retail' 
  | 'ecommerce' 
  | 'saas' 
  | 'manufacturing' 
  | 'finance' 
  | 'healthcare' 
  | 'logistics' 
  | 'professional-services'
  | 'education'
  | 'hospitality'
  | 'other';

/**
 * Business size for template complexity matching
 */
export type BusinessSize = 'small' | 'medium' | 'large' | 'enterprise';

/**
 * Dashboard purpose for tag matching
 */
export type DashboardPurpose = 
  | 'executive-overview' 
  | 'sales-analysis' 
  | 'marketing-performance' 
  | 'financial-reporting' 
  | 'operational-efficiency' 
  | 'customer-insights'
  | 'product-performance';

/**
 * User input for template recommendation
 */
export interface TemplateSelectionInput {
  businessType: BusinessType;
  businessSize: BusinessSize;
  dashboardPurpose: DashboardPurpose;
  availableDataCategories: DataCategory[];
  audienceRole?: string;
}

/**
 * Template recommendation with score
 */
interface TemplateRecommendation {
  templateId: string;
  templateName: string;
  score: number;
  matchReasons: string[];
  missingDataCategories?: DataCategory[];
}

/**
 * Maps business types to industries used in templates
 */
const businessTypeToIndustry = {
  'retail': ['retail'],
  'ecommerce': ['retail', 'ecommerce'],
  'saas': ['saas', 'technology'],
  'manufacturing': ['manufacturing', 'production'],
  'finance': ['finance', 'accounting'],
  'healthcare': ['healthcare'],
  'logistics': ['logistics', 'supply chain'],
  'professional-services': ['professional-services', 'general'],
  'education': ['education', 'general'],
  'hospitality': ['hospitality', 'service'],
  'other': ['general']
};

/**
 * Maps business size to complexity
 */
const businessSizeToComplexity = {
  'small': 'low',
  'medium': 'medium',
  'large': 'medium',
  'enterprise': 'high'
} as const;

/**
 * Maps dashboard purpose to tags
 */
const purposeToTags = {
  'executive-overview': ['executive', 'overview', 'kpi'],
  'sales-analysis': ['sales', 'revenue', 'conversion'],
  'marketing-performance': ['marketing', 'campaigns', 'conversion'],
  'financial-reporting': ['finance', 'budget', 'costs', 'revenue'],
  'operational-efficiency': ['operations', 'efficiency', 'quality'],
  'customer-insights': ['customers', 'segments', 'behavior'],
  'product-performance': ['products', 'performance', 'sales']
};

/**
 * Maps data categories to template data requirements
 */
const dataCategoryToRequirementKeywords = {
  'revenue': ['revenue', 'sales', 'income'],
  'customers': ['customer', 'user', 'client'],
  'operations': ['operations', 'production', 'efficiency', 'process'],
  'marketing': ['marketing', 'campaign', 'conversion'],
  'sales': ['sales', 'conversion', 'funnel'],
  'finance': ['finance', 'budget', 'expense', 'cost', 'margin', 'profit'],
  'quality': ['quality', 'defect', 'performance'],
  'performance': ['performance', 'efficiency', 'productivity'],
  'geographic': ['geographic', 'regional', 'location'],
  'products': ['product', 'item', 'sku', 'service'],
  'time-series': ['time', 'trend', 'period', 'over time']
};

/**
 * Determine data requirements a template needs based on its data requirements
 */
function getTemplateDataCategories(template: any): DataCategory[] {
  const categories: DataCategory[] = [];
  
  if (!template.dataRequirements || !Array.isArray(template.dataRequirements)) {
    return categories;
  }
  
  // Combine all requirements into one string for easier searching
  const requirementsText = template.dataRequirements.join(' ').toLowerCase();
  
  // Check each data category
  (Object.keys(dataCategoryToRequirementKeywords) as DataCategory[]).forEach(category => {
    const keywords = dataCategoryToRequirementKeywords[category];
    // If any keyword is found in the requirements, add the category
    if (keywords.some(keyword => requirementsText.includes(keyword))) {
      categories.push(category);
    }
  });
  
  return categories;
}

/**
 * Calculate template match score based on business needs
 */
function calculateTemplateScore(
  template: any, 
  input: TemplateSelectionInput
): TemplateRecommendation {
  const matchReasons: string[] = [];
  let score = 0;
  
  // Industry match (35%)
  const industryMatch = businessTypeToIndustry[input.businessType].some(
    industry => template.industry.includes(industry) || template.industry.includes('all')
  );
  if (industryMatch) {
    score += CRITERIA_WEIGHTS.industryMatch;
    matchReasons.push(`Suitable for ${input.businessType} businesses`);
  }
  
  // Complexity match (20%)
  const idealComplexity = businessSizeToComplexity[input.businessSize];
  if (template.complexity === idealComplexity) {
    score += CRITERIA_WEIGHTS.complexityMatch;
    matchReasons.push(`Complexity appropriate for ${input.businessSize} businesses`);
  } else if (
    (idealComplexity === 'low' && template.complexity === 'medium') ||
    (idealComplexity === 'high' && template.complexity === 'medium')
  ) {
    // Partial match for adjacent complexity levels
    score += CRITERIA_WEIGHTS.complexityMatch * 0.5;
  }
  
  // Tag match (15%)
  const purposeTags = purposeToTags[input.dashboardPurpose] || [];
  const tagMatchCount = template.tags.filter((tag: string) => 
    purposeTags.includes(tag)
  ).length;
  
  if (tagMatchCount > 0) {
    const tagMatchScore = Math.min(tagMatchCount / purposeTags.length, 1) * CRITERIA_WEIGHTS.tagMatch;
    score += tagMatchScore;
    matchReasons.push(`Contains relevant visualizations for ${input.dashboardPurpose}`);
  }
  
  // Data availability (30%)
  const templateDataCategories = getTemplateDataCategories(template);
  const availableDataCategories = input.availableDataCategories;
  
  const missingDataCategories: DataCategory[] = templateDataCategories.filter(
    category => !availableDataCategories.includes(category)
  );
  
  const dataAvailabilityScore = templateDataCategories.length > 0 
    ? (templateDataCategories.length - missingDataCategories.length) / templateDataCategories.length * CRITERIA_WEIGHTS.dataAvailability
    : 0;
  
  score += dataAvailabilityScore;
  
  if (missingDataCategories.length === 0 && templateDataCategories.length > 0) {
    matchReasons.push('All required data categories are available');
  } else if (templateDataCategories.length > 0) {
    const availabilityPercent = Math.round(
      (templateDataCategories.length - missingDataCategories.length) / templateDataCategories.length * 100
    );
    if (availabilityPercent >= 50) {
      matchReasons.push(`${availabilityPercent}% of required data categories available`);
    }
  }
  
  // Audience match (bonus)
  if (input.audienceRole && template.bestFor.toLowerCase().includes(input.audienceRole.toLowerCase())) {
    score += 0.05; // Bonus 5%
    matchReasons.push(`Designed for ${input.audienceRole} users`);
  }
  
  return {
    templateId: template.id,
    templateName: template.name,
    score: Math.min(score, 1), // Cap at 1 (100%)
    matchReasons,
    missingDataCategories: missingDataCategories.length > 0 ? missingDataCategories : undefined
  };
}

/**
 * Recommends dashboard templates based on business needs
 */
export function recommendTemplates(
  input: TemplateSelectionInput,
  limit: number = 3
): TemplateRecommendation[] {
  const recommendations = dashboardTemplates.map(template => 
    calculateTemplateScore(template, input)
  );
  
  // Sort by score (highest first)
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Returns missing data categories for a specific template
 */
export function getMissingDataRequirements(
  templateId: string,
  availableDataCategories: DataCategory[]
): DataCategory[] {
  const template = dashboardTemplates.find(t => t.id === templateId);
  if (!template) return [];
  
  const templateDataCategories = getTemplateDataCategories(template);
  return templateDataCategories.filter(
    category => !availableDataCategories.includes(category)
  );
}

export default { 
  recommendTemplates,
  getMissingDataRequirements,
  getTemplatesByIndustry,
  getTemplatesByTag
}; 