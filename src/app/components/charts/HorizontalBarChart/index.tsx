// src/app/components/charts/HorizontalBarChart/index.tsx
'use client';

import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export interface HorizontalBarChartData {
  label: string;
  value: number;
}

export interface HorizontalBarChartProps {
  data: HorizontalBarChartData[];
  title: string;
}

const HorizontalBarChart = ({ data, title }: HorizontalBarChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: data.map(item => item.label),
        datasets: [{
          data: data.map(item => item.value),
          backgroundColor: 'rgba(66, 82, 150, 0.8)',
          borderColor: 'rgb(66, 82, 150)',
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 20,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' }
          },
        },
        scales: {
          x: {
            grid: { display: false },
            beginAtZero: true,
          },
          y: {
            grid: { display: false },
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, title]);

  return <canvas ref={chartRef} />;
};

export default HorizontalBarChart;