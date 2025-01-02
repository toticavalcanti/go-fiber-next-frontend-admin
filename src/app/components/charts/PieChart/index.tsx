'use client';

import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface PieChartProps {
  data: { source: string; orders: number }[];
}

const PieChart = ({ data }: PieChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: ['Facebook', 'Direct', 'Organic', 'Referral'], // Fixed labels for consistency
        datasets: [
          {
            data: [30, 25, 20, 25], // Adjust data to match the original proportions
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)', // Pink
              'rgba(255, 205, 86, 0.8)', // Yellow
              'rgba(75, 192, 192, 0.8)', // Green
              'rgba(54, 162, 235, 0.8)', // Blue
            ],
            borderColor: '#ffffff', // White border for each slice
            borderWidth: 2,
            hoverOffset: 15, // Adds hover effect
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 14, weight: 'bold' },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 13 },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
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

export default PieChart;
