import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Trash2 } from 'lucide-react';

const ExpenseTable = () => {
  const { deleteExpense, updateExpense, getTotals } = useExpenses();
  const { filtered: filteredExpenses } = getTotals();

  const handleAmountChange = (id, newAmount) => {
    updateExpense(id, { amount: parseFloat(newAmount) || 0 });
  };

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const formatCurrency = (val) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);

  return (
    <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.4rem' }}>📋 Historial de Gastos</h2>
      </div>

      <div className="table-responsive" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'hsla(230, 25%, 5%, 0.5)' }}>
            <tr>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500' }}>DESCRIPCIÓN</th>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500' }}>CATEGORÍA</th>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500' }}>TIPO</th>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500' }}>FECHA</th>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'right' }}>MONTO (Click para editar)</th>
              <th style={{ padding: '1rem', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? filteredExpenses.map((e) => (
              <tr key={e.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{e.description}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    background: 'var(--glass-bg)', 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-color)' 
                  }}>
                    {e.category}
                  </span>
                </td>
                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                  {e.type === 'hormiga' ? '🐜 Hormiga' : e.type === 'fixed' ? '⚙️ Fijo' : '🔄 Variable'}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>{e.date}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <input 
                    type="number"
                    defaultValue={e.amount}
                    onBlur={(evt) => handleAmountChange(e.id, evt.target.value)}
                    style={{ 
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      width: '100px',
                      outline: 'none',
                      borderBottom: '1px dashed var(--border-color)'
                    }}
                  />
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => deleteExpense(e.id)} 
                    style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>No hay gastos en este periodo.</td>
              </tr>
            )}
          </tbody>
          <tfoot style={{ background: 'hsla(230, 25%, 5%, 0.5)' }}>
             <tr>
               <td colSpan="4" style={{ padding: '1rem', fontWeight: '600' }}>Total Periodo</td>
               <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)' }}>{formatCurrency(totalFiltered)}</td>
               <td></td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
