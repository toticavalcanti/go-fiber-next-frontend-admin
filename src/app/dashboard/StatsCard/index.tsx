// src/app/components/dashboard/StatsCard.tsx
import { Card } from "@/app/components/common/ui/card";

import { cn } from "@/app/types/style";
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  percentageChange: number;
  icon: ReactNode;
}

export function StatsCard({ title, value, percentageChange, icon }: StatsCardProps) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          </div>
          <div className={cn(
            "flex items-center text-sm font-medium",
            percentageChange >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {percentageChange >= 0 ? "+" : ""}{percentageChange}%
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>
    </Card>
  );
}