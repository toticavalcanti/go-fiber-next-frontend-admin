//path: src/app/components/dashboard/TopProducts/index.tsx
import Image from 'next/image';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, ImageIcon } from 'lucide-react';
import type { TopProductAnalytics } from '@/app/types/product';

interface TopProductsProps {
  products: TopProductAnalytics[];
}

const TopProducts = ({ products }: TopProductsProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 col-span-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="w-4 h-4 text-red-500" />;
      case 'down':
        return <ArrowDownIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ArrowRightIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const renderProductImage = (product: TopProductAnalytics) => {
    if (!product.image) {
      return (
        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="h-12 w-12 relative flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name || 'Product image'}
          fill
          className="rounded object-cover"
          sizes="48px"
          onError={() => {
            const placeholder = document.createElement('div');
            placeholder.className = 'h-12 w-12 rounded bg-gray-100 flex items-center justify-center';
            placeholder.innerHTML = '<svg width="24" height="24" class="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
            const imageContainer = document.querySelector(`#product-image-${product.id}`);
            if (imageContainer) {
              imageContainer.innerHTML = '';
              imageContainer.appendChild(placeholder);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-4 text-left text-sm font-medium text-gray-500">PRODUCT</th>
              <th className="px-3 py-4 text-right text-sm font-medium text-gray-500">VALUE</th>
              <th className="px-3 py-4 text-right text-sm font-medium text-gray-500">ADS SPENT</th>
              <th className="px-3 py-4 text-right text-sm font-medium text-gray-500">REFUNDS</th>
              <th className="px-3 py-4 text-right text-sm font-medium text-gray-500">STOCK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div id={`product-image-${product.id}`}>
                      {renderProductImage(product)}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-green-600">{product.sales} orders</span>
                        {product.category && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{product.category.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-right text-gray-900 font-medium">
                  {formatCurrency(product.revenue)}
                </td>
                <td className="px-3 py-4 text-right text-gray-900">
                  {formatCurrency(product.adsSpent)}
                </td>
                <td className="px-3 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900">{product.refunds}</span>
                    {getTrendIcon(product.refundTrend)}
                  </div>
                </td>
                <td className="px-3 py-4 text-right">
                  <span className={`${
                    product.stock_level < 10 
                      ? 'text-red-500' 
                      : product.stock_level < 50 
                        ? 'text-yellow-500' 
                        : 'text-gray-900'
                  }`}>
                    {product.stock_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;