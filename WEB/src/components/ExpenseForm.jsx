import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { PlusCircle, Settings } from 'lucide-react';
import FixedExpenseManager from './FixedExpenseManager';

const ExpenseForm = () => {
  const { addExpense, categories, fixedConfig, selectedMonth } = useExpenses();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState('variable');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFixedManager, setShowFixedManager] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      type,
      date,
    });

    setAmount('');
    setDescription('');
  };

  const quickAdd = (configItem) => {
    const today = new Date().toISOString().split('T')[0];
    addExpense({ 
      ...configItem, 
      type: 'fixed', 
      date: today 
    });
  };

  return (
    <div className="sidebar-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem' }}>📝 Nuevo Gasto</h2>
          <button 
            onClick={() => setShowFixedManager(!showFixedManager)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
            title="Configurar Gastos Fijos"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Quick Add Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '0.6rem', fontWeight: '600' }}>CONCEPTOS FIJOS (Click para añadir)</p>
          <div className="quick-add-buttons">
            {fixedConfig.map(c => (
              <button 
                key={c.id} 
                onClick={() => quickAdd(c)}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
              >
                + {c.description}
              </button>
            ))}
            {fixedConfig.length === 0 && <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Configura fijos en ⚙️</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '0.4rem', fontSize: '0.8rem' }}>Descripción</label>
            <input 
              className="input-field" 
              placeholder="Ej. Alquiler, Pizza..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '0.4rem', fontSize: '0.8rem' }}>Monto (S/.)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="0.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-row-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
               <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '0.4rem', fontSize: '0.8rem' }}>Categoría</label>
               <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.6rem' }}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
            </div>
            <div>
               <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '0.4rem', fontSize: '0.8rem' }}>Tipo</label>
               <select className="input-field" value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.6rem' }}>
                  <option value="fixed">Gasto Fijo</option>
                  <option value="variable">Gasto Variable</option>
                  <option value="hormiga">Gasto Hormiga</option>
               </select>
            </div>
          </div>
          <div>
             <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '0.4rem', fontSize: '0.8rem' }}>Fecha de Vencimiento / Pago</label>
             <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '0.6rem' }} />
          </div>
          <button className="btn-primary" style={{ marginTop: '0.5rem', height: '48px' }}>
            <PlusCircle size={18} style={{ marginRight: '8px' }} /> Agregar Gasto
          </button>
        </form>
      </div>

      {showFixedManager && (
         <FixedExpenseManager onClose={() => setShowFixedManager(false)} />
      )}
    </div>
  );
};

export default ExpenseForm;
