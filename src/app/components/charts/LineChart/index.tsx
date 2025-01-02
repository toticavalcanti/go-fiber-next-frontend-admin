'use client';

import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface LineChartProps {
  data: { date: string; sum: number }[];
}

const LineChart = ({ data }: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: 'Revenue',
            data: data.map((item) => item.sum),
            borderColor: 'rgb(255, 99, 132)', // Line color
            backgroundColor: 'rgba(255, 99, 132, 0.3)', // Fill color
            fill: true,
            tension: 0.4, // Smooth curves
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#fff',
            pointBorderColor: 'rgb(255, 99, 132)',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 12 },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 13 },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: { display: false },
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

export default LineChart;
