// src/app/components/dashboard/Demographics/index.tsx

import HorizontalBarChart from "../../charts/HorizontalBarChart";

interface DemographicsProps {
    data: { label: string; value: number }[];
  }
  
  const Demographics = ({ data }: DemographicsProps) => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Sales by Age
        </h2>
        <div className="h-[300px]">
          <HorizontalBarChart data={data} title="" />
        </div>
      </div>
    );
  };
  
  export default Demographics;