'use client';

import { useEffect, useState } from 'react';
import Wrapper from '@/app/components/common/Wrapper';
import { api } from '@/app/lib/api/fetch';
import type {
  ChartData,
  MetricsData,
  AgeAnalyticsResponse,
  CountryAnalyticsResponse,
} from '@/app/types/chart-data';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import LineChart from '../components/charts/LineChart';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import CountryTable from '../components/dashboard/CountryTable';

const Dashboard = () => {
  const [salesData, setSalesData] = useState<ChartData[]>([]);
  const [ageData, setAgeData] = useState<{ label: string; value: number }[]>(
    []
  );
  const [countryData, setCountryData] = useState<
    { country: string; code: string; sales: number; bounce: number }[]
  >([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
  });

  useEffect(() => {
    const initializeCharts = async () => {
      try {
        // Fetch all data in parallel
        const [chartResponse, ageResponse, countryResponse] = await Promise.all(
          [
            api.get<ChartData[]>('/admin/analytics/chart'),
            api.get<AgeAnalyticsResponse>('/admin/analytics/age'),
            api.get<CountryAnalyticsResponse>('/admin/analytics/sources/country'),
          ]
        );

        // Validate chart data
        if (!Array.isArray(chartResponse)) {
          throw new Error('Invalid chart data format');
        }

        // Format sales data
        const formattedData = chartResponse.map((item) => ({
          ...item,
          sum: typeof item.sum === 'string' ? parseFloat(item.sum) : item.sum,
        }));
        setSalesData(formattedData);

        // Format age data if available
        if (ageResponse && ageResponse.data) {
          setAgeData(
            ageResponse.data.map((item) => ({
              label: item.age_group,
              value: item.orders,
            }))
          );
        }

        // Format country data if available
        if (countryResponse && countryResponse.data) {
          setCountryData(
            countryResponse.data.map((item) => ({
              country: item.country,
              code: item.country.substring(0, 2),
              sales: item.orders,
              bounce: item.percentage,
            }))
          );
        }

        // Calculate metrics
        const totalSales = formattedData.reduce(
          (acc, curr) => acc + curr.sum,
          0
        );
        setMetrics({
          totalSales,
          totalOrders: formattedData.length,
          activeUsers: formattedData.length * 5,
          salesGrowth: 20.1,
          ordersGrowth: 180.1,
          usersGrowth: 19,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    initializeCharts();
  }, []);

  return (
    <Wrapper>
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Total Sales
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(metrics.totalSales)}
          </p>
          <span className="text-sm text-green-600">
            +{metrics.salesGrowth}% from last month
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Total Orders
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metrics.totalOrders}
          </p>
          <span className="text-sm text-green-600">
            +{metrics.ordersGrowth}% from last month
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Active Users
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metrics.activeUsers}
          </p>
          <span className="text-sm text-green-600">
            +{metrics.usersGrowth}% from last month
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sales Analysis
          </h2>
          <div className="h-[300px]">
            <BarChart
              data={salesData.map((item) => ({
                date: item.date,
                sum:
                  typeof item.sum === 'number'
                    ? item.sum
                    : parseFloat(item.sum),
              }))}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Channels</h2>
          <div className="h-[300px]">
            <PieChart
              data={salesData.map((item) => ({
                source: item.date,
                orders:
                  typeof item.sum === 'number'
                    ? item.sum
                    : parseFloat(item.sum),
                revenue:
                  typeof item.sum === 'number'
                    ? item.sum
                    : parseFloat(item.sum),
                customers:
                  (typeof item.sum === 'number'
                    ? item.sum
                    : parseFloat(item.sum)) * 0.1,
              }))}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sales by Age
          </h2>
          <div className="h-[300px]">
            <HorizontalBarChart data={ageData} title="" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sales by Country
          </h2>
          <CountryTable data={countryData} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Trend
          </h2>
          <div className="h-[300px]">
            <LineChart
              data={salesData.map((item) => ({
                date: item.date,
                sum:
                  typeof item.sum === 'number'
                    ? item.sum
                    : parseFloat(item.sum),
              }))}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;
