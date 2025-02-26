import {
  DashboardComponentSizes,
  ComponentSize,
  DashboardComponent,
  Breakpoint,
  ResponsivePosition
} from '../types/dashboard';

export function validateComponentSize(
  component: DashboardComponent,
  sizes: DashboardComponentSizes
): boolean {
  const componentType = sizes.visualizationComponents.find(vc => vc.type === component.type) ||
                       sizes.filterComponents.find(fc => fc.type === component.type);

  if (!componentType) {
    console.warn(`Unknown component type: ${component.type}`);
    return false;
  }

  const { minimum } = componentType.sizes;
  const { width, height } = component.position;

  return width >= minimum.width && height >= minimum.height;
}

export function getResponsivePosition(
  component: DashboardComponent,
  breakpoint: Breakpoint
): ResponsivePosition {
  const responsiveLayout = component.position.responsive?.[breakpoint];
  if (responsiveLayout) {
    return responsiveLayout;
  }

  return {
    row: component.position.row,
    column: component.position.column,
    width: component.position.width,
    height: component.position.height,
  };
}

export function getGridItemStyle(
  component: DashboardComponent,
  breakpoint: Breakpoint,
  columns: number
) {
  const position = getResponsivePosition(component, breakpoint);
  const { row, column, width, height } = position;

  return {
    gridColumn: `${column} / span ${Math.min(width, columns)}`,
    gridRow: `${row} / span ${height}`,
    display: position.visible === false ? 'none' : undefined,
  };
}

export function getRecommendedSize(
  componentType: string,
  sizes: DashboardComponentSizes
): ComponentSize {
  const visualComponent = sizes.visualizationComponents.find(vc => vc.type === componentType);
  if (visualComponent) {
    return visualComponent.sizes.recommended;
  }

  const filterComponent = sizes.filterComponents.find(fc => fc.type === componentType);
  if (filterComponent) {
    return filterComponent.sizes.recommended;
  }

  return { width: 1, height: 1 };
}

export function calculatePixelDimensions(
  gridDimensions: { width: number; height: number },
  layout: { columns: number; rows: number; gap: number }
): { cellWidth: number; cellHeight: number } {
  const totalGapWidth = (layout.columns - 1) * layout.gap;
  const totalGapHeight = (layout.rows - 1) * layout.gap;
  
  const cellWidth = (gridDimensions.width - totalGapWidth) / layout.columns;
  const cellHeight = (gridDimensions.height - totalGapHeight) / layout.rows;

  return { cellWidth, cellHeight };
}