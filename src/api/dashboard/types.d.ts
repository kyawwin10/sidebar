type DashboardType = {
  // Metric Cards
  totalRevenue?: number;
  newCustomers?: number;
  activeAccounts?: number;
  growthRate?: number;

  // Bar Chart: Sales over recent dates
  barChartData: ChartDataPointType[];

  // Area Chart: Total and completed orders over months
  areaChartData: AreaChartDataType[];

  // Donut Chart: Order status distribution
  donutChartData: DonutChartDataType[];

  // Recent Sales
  recentSales: RecentSaleType[];
};

type ChartDataPointType = {
  label?: string; // e.g., "Apr 8"
  value?: number; // Sales amount
};

type AreaChartDataType = {
  month?: string; // e.g., "Jan"
  totalOrders?: number;
  completedOrders?: number;
};

type DonutChartDataType = {
  label?: string; // Status like "ordered", "completed"
  value?: number; // Count of orders
};

type RecentSaleType = {
  name?: string;
  email?: string;
  amount?: string; // Formatted as currency
  avatar?: string; // Profile image URL
};
