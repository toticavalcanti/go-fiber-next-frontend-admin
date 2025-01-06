// src/app/components/dashboard/SalesAnalysis/index.tsx
import { ChartData } from '@/app/types/chart-data';
import BarChart from '@/app/components/charts/BarChart';

interface SalesAnalysisProps {
  data: ChartData[];
}

const SalesAnalysis = ({ data }: SalesAnalysisProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Sales Analysis
      </h2>
      <div className="h-[300px]">
        <BarChart
          data={data.map((item) => ({
            date: item.date,
            sum: typeof item.sum === 'number' ? item.sum : parseFloat(item.sum),
          }))}
        />
      </div>
    </div>
  );
};

export default SalesAnalysis;