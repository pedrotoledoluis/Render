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
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500' }}>VENCIMIENTO (Click editar)</th>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>PAGADO</th>
              <th style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'right' }}>MONTO (Click editar)</th>
              <th style={{ padding: '1rem', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? filteredExpenses.map((e) => {
              const today = new Date();
              today.setHours(0,0,0,0);
              // Avoid timezone shift by passing year, month, day explicitly
              const [y, m, d] = e.date.split('-');
              const dueDate = new Date(y, m - 1, d);
              const diffTime = dueDate - today;
              const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              let statusColor = 'var(--text-dim)';
              let statusText = '';
              let statusBg = 'transparent';

              if (!e.is_paid) {
                  if (daysLeft < 0) {
                      statusColor = '#ef4444'; // Red
                      statusText = '¡Vencido!';
                      statusBg = 'rgba(239, 68, 68, 0.15)';
                  } else if (daysLeft <= 3) {
                      statusColor = '#fbbf24'; // Yellow
                      statusText = daysLeft === 0 ? '¡Hoy!' : `Faltan ${daysLeft} d`;
                      statusBg = 'rgba(251, 191, 36, 0.15)';
                  }
              } else {
                  statusColor = '#10b981'; // Green
                  statusText = 'Pagado';
              }

              return (
              <tr key={e.id} style={{ borderTop: '1px solid var(--border-color)', opacity: e.is_paid ? 0.6 : 1, transition: '0.3s' }}>
                <td style={{ padding: '1rem', textDecoration: e.is_paid ? 'line-through' : 'none' }}>{e.description}</td>
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
                <td style={{ padding: '1rem', color: statusColor, fontWeight: (!e.is_paid && daysLeft <= 3) ? 'bold' : 'normal' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                     <input 
                        type="date"
                        defaultValue={e.date}
                        onBlur={(evt) => {
                          if (evt.target.value && evt.target.value !== e.date) {
                            updateExpense(e.id, { date: evt.target.value });
                          }
                        }}
                        style={{
                           background: 'transparent',
                           border: 'none',
                           color: 'var(--text-main)',
                           outline: 'none',
                           borderBottom: '1px dashed var(--border-color)',
                           fontSize: '0.85rem'
                        }}
                     />
                     {statusText && (
                       <span style={{ background: statusBg, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                         {statusText}
                       </span>
                     )}
                   </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={!!e.is_paid} 
                    onChange={(evt) => updateExpense(e.id, { is_paid: evt.target.checked })}
                    style={{ transform: 'scale(1.5)', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                </td>
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
            )}) : (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>No hay gastos en este periodo.</td>
              </tr>
            )}
          </tbody>
           <tfoot style={{ background: 'hsla(230, 25%, 5%, 0.5)' }}>
             <tr>
               <td colSpan="5" style={{ padding: '1rem', fontWeight: '600' }}>Total (Sólo Pagados)</td>
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
