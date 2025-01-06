// src/app/components/dashboard/CountryTable/index.tsx
'use client';
import Image from 'next/image';

interface CountryData {
  country: string;
  code: string;
  sales: number;
  bounce: number;
}

interface CountryTableProps {
  data: CountryData[];
}

const CountryTable = ({ data }: CountryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left pb-4 font-medium text-gray-500">Country</th>
            <th className="text-right pb-4 font-medium text-gray-500">Sales</th>
            <th className="text-right pb-4 font-medium text-gray-500">Bounce</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-gray-100">
              <td className="py-3">
                <div className="flex items-center gap-2">
                <Image
                   src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                   alt={item.country}
                   width={20}
                   height={16}
                   className="object-cover"
                 />
                  <span className="font-medium text-gray-700">{item.country}</span>
                </div>
              </td>
              <td className="text-right py-3 text-gray-700">
                {item.sales.toLocaleString()}
              </td>
              <td className="text-right py-3 text-gray-700">
                {item.bounce.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryTable;