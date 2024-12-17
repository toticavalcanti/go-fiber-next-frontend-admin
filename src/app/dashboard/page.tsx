// src/app/dashboard/page.tsx
'use client';

import Wrapper from '@/app/components/common/Wrapper';
import { useRef, useEffect, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { api } from '@/app/lib/api/fetch';
import type { ChartData } from '@/app/types/chart-data';

// Interface for Dashboard Metrics
interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  activeUsers: number;
  salesGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

const Dashboard = () => {
  // References for canvas elements
  const chartBarRef = useRef<HTMLCanvasElement>(null);
  const chartPieRef = useRef<HTMLCanvasElement>(null);
  const chartLineRef = useRef<HTMLCanvasElement>(null);

  // Array to store chart instances
  const chartInstances = useRef<Chart[]>([]);

  // State for dashboard metrics
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
  });

  // Register all Chart.js components
  Chart.register(...registerables);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch chart data from API
        const response = await api.get<ChartData[]>('/admin/analytics/chart');

        if (!Array.isArray(response) || response.length === 0) {
          throw new Error('Invalid data format');
        }

        // Calculate dashboard metrics
        const totalSales = response.reduce((acc, curr) => acc + Number(curr.sum), 0);

        setMetrics({
          totalSales,
          totalOrders: response.length,
          activeUsers: response.length * 5, // Example calculation
          salesGrowth: 20.1,
          ordersGrowth: 180.1,
          usersGrowth: 19,
        });

        // Destroy previous chart instances to avoid conflicts
        chartInstances.current.forEach((chart) => chart.destroy());
        chartInstances.current = [];

        // Initialize Bar Chart (Sales Analysis)
        if (chartBarRef.current) {
          const barChart = new Chart(chartBarRef.current, {
            type: 'bar',
            data: {
              labels: response.map((item) => item.date),
              datasets: [
                {
                  label: 'Sales',
                  data: response.map((item) => Number(item.sum)),
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1,
                },
              ],
            },
            options: { responsive: true, maintainAspectRatio: false },
          });
          chartInstances.current.push(barChart);
        }

        // Initialize Pie Chart (Channels)
        if (chartPieRef.current) {
          const pieChartConfig: ChartConfiguration<'pie', number[], string> = {
            type: 'pie',
            data: {
              labels: ['Facebook', 'Direct', 'Organic', 'Referral'],
              datasets: [
                {
                  label: 'Channels',
                  data: [30, 25, 20, 25],
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                  hoverOffset: 4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: '#333',
                  },
                },
              },
            },
          };

          const pieChart = new Chart(chartPieRef.current, pieChartConfig);
          chartInstances.current.push(pieChart);
        }

        // Initialize Line Chart (Revenue Trend)
        if (chartLineRef.current) {
          const lineChart = new Chart(chartLineRef.current, {
            type: 'line',
            data: {
              labels: response.map((item) => item.date),
              datasets: [
                {
                  label: 'Revenue',
                  data: response.map((item) => Number(item.sum)),
                  borderColor: '#FF6384',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  fill: true,
                  tension: 0.3,
                },
              ],
            },
            options: { responsive: true, maintainAspectRatio: false },
          });
          chartInstances.current.push(lineChart);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    return () => {
      // Cleanup all chart instances when component unmounts
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <Wrapper>
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Sales</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              metrics.totalSales
            )}
          </p>
          <span className="text-sm text-green-600">+{metrics.salesGrowth}% from last month</span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.totalOrders}</p>
          <span className="text-sm text-green-600">+{metrics.ordersGrowth}% from last month</span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active Users</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.activeUsers}</p>
          <span className="text-sm text-green-600">+{metrics.usersGrowth}% from last month</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Analysis</h2>
          <div className="h-[300px]">
            <canvas ref={chartBarRef}></canvas>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Channels</h2>
          <div className="h-[300px]">
            <canvas ref={chartPieRef}></canvas>
          </div>
        </div>

        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-[300px]">
            <canvas ref={chartLineRef}></canvas>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;
