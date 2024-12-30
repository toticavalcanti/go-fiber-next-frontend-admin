'use client';

import Wrapper from '@/app/components/common/Wrapper';
import { useRef, useEffect, useReducer } from 'react';
import { Chart, ChartType, registerables } from 'chart.js';
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

interface ShadowPluginOptions {
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
}

const Dashboard = () => {
  // Refs para os elementos canvas
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  
  // Refs para as instâncias dos gráficos
  const barChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  const lineChartInstance = useRef<Chart | null>(null);
  
  // Ref para as métricas
  const metricsRef = useRef<DashboardMetrics>({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
  });

  const createShadowPlugin = (options: ShadowPluginOptions = {}) => {
    const {
      color = 'rgba(0, 0, 0, 0.2)',
      blur = 15,
      offsetX = 4,
      offsetY = 4
    } = options;

    return {
      id: `shadow-${Math.random()}`,
      beforeDraw(chart: Chart<ChartType>): void {
        const { ctx } = chart;
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;
      },
      afterDraw(chart: Chart<ChartType>): void {
        chart.ctx.restore();
      }
    };
  };

  // Registra os componentes do Chart.js uma única vez
  useEffect(() => {
    Chart.register(...registerables);
    return () => {
      // Cleanup na desmontagem do componente
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
    };
  }, []);

  // Inicializa e atualiza os gráficos
  useEffect(() => {
    const initializeCharts = async () => {
      try {
        // Busca os dados
        const response = await api.get<ChartData[]>('/admin/analytics/chart');

        if (!Array.isArray(response) || response.length === 0) {
          throw new Error('Invalid data format');
        }

        // Calcula as métricas
        const totalSales = response.reduce((acc, curr) => acc + Number(curr.sum), 0);
        metricsRef.current = {
          totalSales,
          totalOrders: response.length,
          activeUsers: response.length * 5,
          salesGrowth: 20.1,
          ordersGrowth: 180.1,
          usersGrowth: 19,
        };

        // Destrói gráficos existentes antes de recriar
        if (barChartInstance.current) {
          barChartInstance.current.destroy();
          barChartInstance.current = null;
        }
        if (pieChartInstance.current) {
          pieChartInstance.current.destroy();
          pieChartInstance.current = null;
        }
        if (lineChartInstance.current) {
          lineChartInstance.current.destroy();
          lineChartInstance.current = null;
        }

        // Cria gráfico de barras
        if (barChartRef.current) {
          barChartInstance.current = new Chart(barChartRef.current, {
            type: 'bar',
            plugins: [createShadowPlugin()],
            data: {
              labels: response.map((item) => item.date),
              datasets: [{
                label: 'Sales',
                data: response.map((item) => Number(item.sum)),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 20,
                maxBarThickness: 30,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { display: false }
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    display: true,
                  },
                  border: { display: false }
                }
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleFont: { size: 13 },
                  padding: 12,
                  cornerRadius: 8
                }
              }
            },
          });
        }

        // Cria gráfico de pizza
        if (pieChartRef.current) {
          pieChartInstance.current = new Chart(pieChartRef.current, {
            type: 'pie',
            plugins: [createShadowPlugin()],
            data: {
              labels: ['Facebook', 'Direct', 'Organic', 'Referral'],
              datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                offset: 10,
                hoverOffset: 15,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom' as const,
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { size: 12, weight: 'bold' }
                  }
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
                      const total = (context.chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${label}: ${percentage}%`;
                    }
                  }
                }
              }
            }
          });
        }

        // Cria gráfico de linha
        if (lineChartRef.current) {
          lineChartInstance.current = new Chart(lineChartRef.current, {
            type: 'line',
            plugins: [createShadowPlugin()],
            data: {
              labels: response.map((item) => item.date),
              datasets: [{
                label: 'Revenue',
                data: response.map((item) => Number(item.sum)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgb(255, 99, 132)',
                pointBorderWidth: 2,
              }],
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
                    font: { size: 12 }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleFont: { size: 13 },
                  bodyFont: { size: 13 },
                  padding: 12,
                  cornerRadius: 8
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    display: true,
                  },
                  border: { display: false }
                },
                x: {
                  grid: { display: false },
                  border: { display: false }
                }
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }
          });
        }

        // Força uma atualização do componente
        forceUpdate();

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    initializeCharts();
  }, []); // Executa apenas na montagem

  // Força atualização do componente
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return (
    <Wrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Sales</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              metricsRef.current.totalSales
            )}
          </p>
          <span className="text-sm text-green-600">+{metricsRef.current.salesGrowth}% from last month</span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metricsRef.current.totalOrders}</p>
          <span className="text-sm text-green-600">+{metricsRef.current.ordersGrowth}% from last month</span>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active Users</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metricsRef.current.activeUsers}</p>
          <span className="text-sm text-green-600">+{metricsRef.current.usersGrowth}% from last month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Analysis</h2>
          <div className="h-[300px]">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Channels</h2>
          <div className="h-[300px]">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-[300px]">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;