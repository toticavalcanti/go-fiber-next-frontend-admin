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
import CountryTable from '../components/dashboard/CountryTable';
import MetricsCards from '../components/dashboard/MetricsCards';
import SalesAnalysis from '../components/dashboard/SalesAnalysis';
import ChannelDistribution from '../components/dashboard/ChannelsDistribution';
import Demographics from '../components/dashboard/Demographics';
import RevenueChart from '../components/dashboard/RevenueChart';

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
    <MetricsCards metrics={metrics} />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SalesAnalysis data={salesData} />
      <ChannelDistribution data={salesData} />
      <Demographics data={ageData} />
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Sales by Country
        </h2>
        <CountryTable data={countryData} />
      </div>
      <RevenueChart data={salesData} />
    </div>
  </Wrapper>
  );
};

export default Dashboard;
