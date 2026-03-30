import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Plus, Trash2, CheckCircle, X } from 'lucide-react';

const FixedExpenseManager = ({ onClose }) => {
  const { fixedConfig, addFixedConfig, deleteFixedConfig, addExpense } = useExpenses();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (!desc || !amount) return;
    addFixedConfig({ description: desc, amount: parseFloat(amount), category: 'Servicios' });
    setDesc('');
    setAmount('');
  };

  const applyAll = () => {
    const monthsArr = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthIndex = monthsArr.indexOf(selectedMonth);
    const year = new Date().getFullYear();
    const date = new Date(year, monthIndex, 1).toISOString().split('T')[0];

    fixedConfig.forEach(item => {
      addExpense({ ...item, type: 'fixed', date });
    });
    alert(`Gastos fijos aplicados a ${selectedMonth}.`);
    onClose();
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" style={{ padding: '2.5rem' }} onClick={(e) => e.stopPropagation()}>
        <button 
           onClick={onClose} 
           style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>⚙️ Configurar Gastos Fijos</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          Define tus cargos recurrentes. El sistema los guardará para que puedas aplicarlos cada mes con un solo clic.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            className="input-field" 
            placeholder="Descripción (ej. Netflix, Luz, Internet)" 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
            style={{ flex: 2 }}
          />
          <input 
            type="number" 
            className="input-field" 
            placeholder="Monto" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={24} />
          </button>
        </div>

        <div style={{ background: 'hsla(230, 25%, 5%, 0.5)', borderRadius: '16px', padding: '1.5rem', minHeight: '100px', maxHeight: '300px', overflowY: 'auto' }}>
          {fixedConfig.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {fixedConfig.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.description}</span>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>{formatCurrency(item.amount)}</span>
                    <button 
                      onClick={() => deleteFixedConfig(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No hay gastos fijos configurados.</p>
          )}
        </div>

        {fixedConfig.length > 0 && (
          <button 
            onClick={applyAll}
            className="btn-primary" 
            style={{ width: '100%', marginTop: '2rem', height: '56px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <CheckCircle size={22} style={{ marginRight: '10px' }} /> Aplicar al Mes Actual
          </button>
        )}
      </div>
    </div>
  );
};

export default FixedExpenseManager;
