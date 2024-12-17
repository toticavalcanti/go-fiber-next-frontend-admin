// src/app/dashboard/page.tsx
'use client';

import Wrapper from '@/app/components/common/Wrapper';
import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { api } from '@/app/lib/api/fetch';
import type { ChartData } from '@/app/types/chart-data';

interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  activeUsers: number;
  salesGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

const Dashboard = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0
  });

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const response = await api.get<ChartData[]>('/admin/analytics/chart');

        if (!Array.isArray(response) || response.length === 0) {
          throw new Error('Invalid data format');
        }

        // Calcular métricas dos dados do gráfico
        const totalSales = response.reduce((acc, curr) => {
          const value = typeof curr.sum === 'string' ? parseFloat(curr.sum) : curr.sum;
          return acc + value;
        }, 0);

        // Atualizar métricas
        setMetrics({
          totalSales,
          totalOrders: response.length, // Número de registros como total de ordens
          activeUsers: response.length * 5, // Exemplo: 5 usuários por ordem
          salesGrowth: 20.1,
          ordersGrowth: 180.1,
          usersGrowth: 19
        });

        if (chartRef.current) {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }

          chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'bar',
            data: {
              labels: response.map(item => item.date),
              datasets: [{
                label: 'Sales',
                data: response.map(item => 
                  typeof item.sum === 'string' ? parseFloat(item.sum) : item.sum
                ),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 5,
                barThickness: 50
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top' as const,
                  align: 'end' as const,
                  labels: {
                    boxWidth: 10,
                    padding: 20
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      const value = Number(tooltipItem.raw);
                      return `R$ ${value.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2 
                      })}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return `R$ ${Number(value).toLocaleString('pt-BR')}`;
                    }
                  }
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchDataAndRenderChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Wrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Sales
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(metrics.totalSales)}
          </p>
          <span className="inline-block mt-2 text-sm text-green-600">
            +{metrics.salesGrowth}% from last month
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Orders
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metrics.totalOrders.toLocaleString()}
          </p>
          <span className="inline-block mt-2 text-sm text-green-600">
            +{metrics.ordersGrowth}% from last month
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Active Users
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metrics.activeUsers.toLocaleString()}
          </p>
          <span className="inline-block mt-2 text-sm text-green-600">
            +{metrics.usersGrowth}% from last month
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Analysis</h2>
        <div className="h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;