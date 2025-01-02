'use client';

import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
  data: { date: string; sum: number }[];
}

const BarChart = ({ data }: BarChartProps) => {
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
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: 'Sales',
            data: data.map((item) => item.sum),
            backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue bars
            borderColor: 'rgb(59, 130, 246)', // Blue border
            borderWidth: 2,
            borderRadius: 6, // Rounded corners
            barThickness: 20, // Bar thickness
            maxBarThickness: 30,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        plugins: {
          legend: { display: false }, // Hide legend
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default BarChart;
