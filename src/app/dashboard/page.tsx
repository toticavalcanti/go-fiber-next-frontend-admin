'use client';

import Wrapper from '@/app/components/common/Wrapper';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { api } from '@/app/lib/api/fetch';
import { ChartData } from '@/app/types/chart-data';

const Dashboard = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        // Ajuste aqui com base na resposta da sua API
        const response = await api.get<ChartData[]>('/chart');
        const data: ChartData[] = response; // Ou response.data, dependendo da estrutura

        const labels = data.map((item: ChartData) => item.date);
        const salesData = data.map((item: ChartData) => item.sum);

        if (chartRef.current) {
          new Chart(chartRef.current, {
            type: 'bar',
            data: {
              labels,
              datasets: [
                {
                  label: 'Sales',
                  data: salesData,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                tooltip: { enabled: true },
                legend: { display: true, position: 'top' },
              },
              scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { beginAtZero: true, title: { display: true, text: 'Sales' } },
              },
            },
          });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    <Wrapper>
      <h2>Daily Sales</h2>
      <canvas ref={chartRef}></canvas>
    </Wrapper>
  );
};

export default Dashboard;
