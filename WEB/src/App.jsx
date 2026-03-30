import React, { useState } from 'react';
import { useExpenses } from './context/ExpenseContext';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import MonthlyChart from './components/MonthlyChart';
import { LayoutDashboard, ListTodo, Calendar, Filter, Wallet } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    selectedMonth, setSelectedMonth, 
    selectedWeek, setSelectedWeek,
    income, setIncome,
    isLoading 
  } = useExpenses();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
        <h2 className="gradient-text animate-in">Cargando tus finanzas...</h2>
      </div>
    );
  }

  const months = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weeks = ['Todas', 'Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];

  return (
    <div className="app-wrapper" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }} className="gradient-text">App Ahorros</h1>
          <p style={{ color: 'var(--text-dim)' }}>Controla tus finanzas con precisión</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--income)' }}>
              <Wallet size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>INGRESO</span>
            </div>
            <input 
              type="number" 
              className="input-field" 
              style={{ width: '120px', padding: '0.4rem', border: 'none', background: 'transparent' }} 
              value={income} 
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <div className="glass-panel" style={{ padding: '0.4rem', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
              <Calendar size={16} style={{ color: 'var(--text-dim)', marginRight: '8px' }} />
              <select 
                className="input-field" 
                style={{ border: 'none', background: 'transparent', width: '120px', padding: '0.4rem' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 0.5rem', borderLeft: '1px solid var(--border-color)' }}>
              <Filter size={16} style={{ color: 'var(--text-dim)', marginRight: '8px' }} />
              <select 
                className="input-field" 
                style={{ border: 'none', background: 'transparent', width: '110px', padding: '0.4rem' }}
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                {weeks.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <nav className="glass-panel" style={{ padding: '0.4rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
                border: 'none',
                color: activeTab === 'dashboard' ? 'white' : 'var(--text-dim)',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: '0.3s'
              }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('expenses')}
              style={{
                background: activeTab === 'expenses' ? 'var(--primary)' : 'transparent',
                border: 'none',
                color: activeTab === 'expenses' ? 'white' : 'var(--text-dim)',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: '0.3s'
              }}
            >
              <ListTodo size={18} /> Gastos
            </button>
          </nav>
        </div>
      </header>

      <main>
        {activeTab === 'dashboard' ? (
          <div className="animate-in">
            <SummaryCards />
            <div style={{ marginTop: '2.5rem' }}>
              <MonthlyChart />
            </div>
          </div>
        ) : (
          <div className="animate-in tracking-layout">
            <ExpenseForm />
            <ExpenseTable />
          </div>
        )}
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', paddingBottom: '2rem' }}>
        &copy; 2026 App Ahorros Premium - Diseñado para tu libertad financiera
      </footer>
    </div>
  );
}

export default App;
