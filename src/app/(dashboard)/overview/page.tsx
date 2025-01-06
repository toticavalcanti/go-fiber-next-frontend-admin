//path: src/app/overview/page.tsx
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
import type { TopProduct, TopProductAnalytics } from '@/app/types/product';
import CountryTable from '../../components/overview/CountryTable';
import MetricsCards from '../../components/overview/MetricsCards';
import SalesAnalysis from '../../components/overview/SalesAnalysis';
import ChannelDistribution from '../../components/overview/ChannelsDistribution';
import Demographics from '../../components/overview/Demographics';
import RevenueChart from '../../components/overview/RevenueChart';
import TopProducts from '../../components/overview/TopProducts';

const Overview = () => {
 const [salesData, setSalesData] = useState<ChartData[]>([]);
 const [ageData, setAgeData] = useState<{ label: string; value: number }[]>([]);
 const [countryData, setCountryData] = useState<{
   country: string;
   code: string;
   sales: number;
   bounce: number;
 }[]>([]);
 const [topProducts, setTopProducts] = useState<TopProductAnalytics[]>([]);
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
       const [chartResponse, ageResponse, countryResponse, productsResponse] = await Promise.all([
         api.get<ChartData[]>('/admin/analytics/chart'),
         api.get<AgeAnalyticsResponse>('/admin/analytics/age'),
         api.get<CountryAnalyticsResponse>('/admin/analytics/sources/country'),
         api.get<{ data: TopProduct[] }>('/admin/analytics/products/top'),
       ]);

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

       // Format products data
       if (productsResponse?.data) {
         const formattedProducts: TopProductAnalytics[] = productsResponse.data.map(product => ({
           ...product,
           image: undefined,
           adsSpent: parseFloat((Math.random() * 10000).toFixed(2)),
           refunds: Math.floor(Math.random() * 100),
           refundTrend: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
           category: {
             id: 1,
             name: 'Electronics'
           }
         }));
         
         setTopProducts(formattedProducts);
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
       console.error('Error fetching overview data:', error);
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
        <TopProducts products={topProducts} />
      </div>
    </Wrapper>
 );
};

export default Overview;