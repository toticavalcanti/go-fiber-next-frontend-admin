import { Chart, registerables } from 'chart.js';

// Registers all required Chart.js components
Chart.register(...registerables);

export default Chart;
