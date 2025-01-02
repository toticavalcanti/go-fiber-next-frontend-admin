// src/app/components/dashboard/ChannelDistribution/index.tsx
import { ChartData } from '@/app/types/chart-data';
import PieChart from '@/app/components/charts/PieChart';

interface ChannelDistributionProps {
  data: ChartData[];
}

const ChannelDistribution = ({ data }: ChannelDistributionProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Channels</h2>
      <div className="h-[300px]">
        <PieChart
          data={data.map((item) => ({
            source: item.date,
            orders: typeof item.sum === 'number' ? item.sum : parseFloat(item.sum),
            revenue: typeof item.sum === 'number' ? item.sum : parseFloat(item.sum),
            customers: (typeof item.sum === 'number' ? item.sum : parseFloat(item.sum)) * 0.1,
          }))}
        />
      </div>
    </div>
  );
};

export default ChannelDistribution;