// src/app/components/dashboard/RevenueChart/index.tsx
import { ChartData } from '@/app/types/chart-data';
import LineChart from '@/app/components/charts/LineChart';

interface RevenueChartProps {
  data: ChartData[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Revenue Trend
      </h2>
      <div className="h-[300px]">
        <LineChart
          data={data.map((item) => ({
            date: item.date,
            sum: typeof item.sum === 'number' ? item.sum : parseFloat(item.sum),
          }))}
        />
      </div>
    </div>
  );
};

export default RevenueChart;