import { DashboardConfig } from '../types/dashboard';
import dashboardSettings from './dashboardSettings.json';
import dashboardComponents from './dashboardComponents.json';

export const defaultDashboardConfig: DashboardConfig = {
  ...dashboardSettings,
  components: dashboardComponents
};

export default defaultDashboardConfig;