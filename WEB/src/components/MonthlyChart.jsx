import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { supabase } from '../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyChart = () => {
  const { selectedMonth, expenses } = useExpenses();
  const [allExpenses, setAllExpenses] = React.useState([]);
  const [chartType, setChartType] = React.useState('all');
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    const fetchYearlyData = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('year', currentYear);
      
      if (error) console.error('Error fetching yearly data:', error);
      else setAllExpenses(data || []);
    };

    fetchYearlyData();
  }, [selectedMonth, expenses]); // Reload when current month expenses change

  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const dataPoints = new Array(12).fill(0);
  
  allExpenses.forEach(e => {
    if (!e.date) return;
    const parts = e.date.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    
    if (year === currentYear) {
      if (chartType === 'all' || e.type === chartType) {
        dataPoints[month - 1] += Math.abs(parseFloat(e.amount));
      }
    }
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
           label: (context) => `Gasto: S/. ${context.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
        }
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
        beginAtZero: true,
        suggestedMax: 100
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' },
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Gastos',
        data: dataPoints,
        borderColor: 'hsl(250, 100%, 65%)',
        backgroundColor: 'hsla(250, 100%, 65%, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'hsl(250, 100%, 65%)',
      },
    ],
  };

  const filters = [
    { id: 'all', label: 'Total', color: 'var(--primary)' },
    { id: 'fixed', label: 'Fijos ⚙️', color: 'hsl(250, 100%, 65%)' },
    { id: 'variable', label: 'Variables 🔄', color: 'hsl(320, 100%, 65%)' },
    { id: 'hormiga', label: 'Hormiga 🐜', color: 'hsl(180, 100%, 50%)' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '2rem', height: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '1.4rem' }}>
            📈 Evolución de Gastos {currentYear}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Visualiza tus hábitos de gasto por tipo</p>
        </div>
        
        <div className="chart-filters" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '12px' }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setChartType(f.id)}
              style={{
                background: chartType === f.id ? f.color : 'transparent',
                border: 'none',
                color: chartType === f.id ? '#fff' : 'var(--text-dim)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: '0.3s',
                fontWeight: chartType === f.id ? 'bold' : 'normal'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: '320px' }}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default MonthlyChart;
