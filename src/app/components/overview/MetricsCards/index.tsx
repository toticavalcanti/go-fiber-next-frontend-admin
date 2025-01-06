// src/app/components/dashboard/MetricsCards/index.tsx
import { MetricsData } from '@/app/types/chart-data';

interface MetricsCardsProps {
  metrics: MetricsData;
}

const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  return (
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
  );
};

export default MetricsCards;