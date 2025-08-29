import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDashboard } from '@/api/dashboard';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

const DashboardView = () => {
  const { data: dashboard, isLoading } = getDashboard.useQuery();

  // Always call hooks first, even before any conditional return
// Bar Chart
const barData = useMemo(() => ({
  labels: dashboard?.barChartData.map(d => d.label || '') || [],
  datasets: [
    {
      label: 'Sales',
      data: dashboard?.barChartData.map(d => d.value || 0) || [],
      backgroundColor: 'rgba(236, 72, 153, 0.7)', // soft pink
      borderRadius: 4
    }
  ]
}), [dashboard?.barChartData]);

// Area Chart
const areaData = useMemo(() => ({
  labels: dashboard?.areaChartData.map(d => d.month || '') || [],
  datasets: [
    {
      label: 'Total Orders',
      data: dashboard?.areaChartData.map(d => d.totalOrders || 0) || [],
      fill: true,
      backgroundColor: 'rgba(249, 168, 212, 0.3)', // pastel pink
      borderColor: 'rgba(236, 72, 153, 1)', // stronger pink border
      tension: 0.4
    },
    {
      label: 'Completed Orders',
      data: dashboard?.areaChartData.map(d => d.completedOrders || 0) || [],
      fill: true,
      backgroundColor: 'rgba(167, 139, 250, 0.3)', // soft purple
      borderColor: 'rgba(139, 92, 246, 1)', // stronger purple
      tension: 0.4
    }
  ]
}), [dashboard?.areaChartData]);

// Donut Chart
const donutData = useMemo(() => ({
  labels: dashboard?.donutChartData.map(d => d.label || '') || [],
  datasets: [
    {
      data: dashboard?.donutChartData.map(d => d.value || 0) || [],
      backgroundColor: ['#F472B6', '#F9A8D4', '#C4B5FD', '#A7F3D0'], // pink, pastel pink, lavender, mint
      borderWidth: 0
    }
  ]
}), [dashboard?.donutChartData]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Hi, Welcome back 👋</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-900/10">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${dashboard?.totalRevenue?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboard?.newCustomers || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboard?.activeAccounts || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboard?.growthRate || 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart + Recent Sales */}
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>Bar Chart - Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {dashboard?.recentSales.map((sale, idx) => (
              <div key={idx} className="flex items-center py-2 gap-4">
                <Avatar>
                  <AvatarImage src={sale.avatar} />
                  <AvatarFallback>{sale.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{sale.name}</p>
                  <p className="text-xs text-muted-foreground">{sale.email}</p>
                </div>
                <div className="font-medium">{sale.amount}</div>
              </div>
            )) || <p>No recent sales</p>}
          </CardContent>
        </Card>
      </div>

      {/* Area Chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>Area Chart - Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line data={areaData} options={{ responsive: true, maintainAspectRatio: false }} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none rounded-2xl shadow-lg shadow-pink-500/10">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <Doughnut
              data={donutData}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
