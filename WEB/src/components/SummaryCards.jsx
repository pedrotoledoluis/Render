import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const SummaryCards = () => {
  const { income, getTotals } = useExpenses();
  const { totalExpenses, balance, fixed, variable, hormiga } = getTotals();

  const formatCurrency = (val) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);

  const cards = [
    { title: 'Ingresos Mensuales', value: income, icon: Wallet, color: 'var(--income)' },
    { title: 'Gastos Totales', value: totalExpenses, icon: TrendingDown, color: 'var(--expense)' },
    { title: 'Saldo Balance', value: balance, icon: DollarSign, color: 'var(--balance)' },
  ];

  const subStats = [
    { label: 'Fijos', value: fixed, color: 'hsl(250, 100%, 65%)' },
    { label: 'Variables', value: variable, color: 'hsl(320, 100%, 65%)' },
    { label: 'Gasto Hormiga', value: hormiga, color: 'hsl(180, 100%, 50%)' },
  ];

  return (
    <div className="summary-container">
      <div className="dashboard-grid">
        {cards.map((card, i) => (
          <div key={i} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{card.title}</p>
                <h2 style={{ fontSize: '1.8rem', color: card.color }}>{formatCurrency(card.value)}</h2>
              </div>
              <div 
                style={{ 
                  background: `${card.color}22`, 
                  padding: '1rem', 
                  borderRadius: '12px',
                  color: card.color
                }}
              >
                <card.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {subStats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1rem' }}>
             <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{stat.label}</p>
             <h3 style={{ fontSize: '1.2rem', color: stat.color }}>{formatCurrency(stat.value)}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
