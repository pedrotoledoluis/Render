import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [income, setIncomeState] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [fixedConfig, setFixedConfigState] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('Marzo');
  const [selectedWeek, setSelectedWeek] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Servicios', 'Ocio', 'Otros'];

  const year = new Date().getFullYear();

  // Load Config (Fixed Templates)
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setFixedConfigState(data.fixedConfig || []);
      })
      .catch(err => console.error('Error loading config:', err));
  }, []);

  // Load Monthly Data (Income & Expenses)
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/expenses/${year}/${selectedMonth}`)
      .then(res => res.json())
      .then(data => {
        setExpenses(data.expenses || []);
        setIncomeState(data.income || 0);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading monthly data:', err);
        setExpenses([]);
        setIncomeState(0);
        setIsLoading(false);
      });
  }, [selectedMonth, year]);

  const setIncome = (val) => {
    const newVal = parseFloat(val) || 0;
    setIncomeState(newVal);
    saveMonthlyData(newVal, expenses);
  };

  const addFixedConfig = (item) => {
    const newConfig = [...fixedConfig, { ...item, id: Date.now() }];
    setFixedConfigState(newConfig);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary: income, fixedConfig: newConfig })
    });
  };

  const deleteFixedConfig = (id) => {
    const newConfig = fixedConfig.filter(c => c.id !== id);
    setFixedConfigState(newConfig);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary: income, fixedConfig: newConfig })
    });
  };

  const addExpense = (expense) => {
    const newExpenses = [...expenses, { ...expense, id: Date.now() }];
    setExpenses(newExpenses);
    saveMonthlyData(income, newExpenses);
  };

  const deleteExpense = (id) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    setExpenses(newExpenses);
    saveMonthlyData(income, newExpenses);
  };

  const updateExpense = (id, updatedFields) => {
    const newExpenses = expenses.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    setExpenses(newExpenses);
    saveMonthlyData(income, newExpenses);
  };

  const saveMonthlyData = (inc, expList) => {
    fetch(`/api/expenses/${year}/${selectedMonth}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income: inc, expenses: expList })
    });
  };

  const getTotals = () => {
    const filtered = expenses.filter(e => {
      if (selectedWeek === 'Todas') return true;
      const day = new Date(e.date).getUTCDate(); 
      const week = Math.ceil(day / 7);
      return `Semana ${week}` === selectedWeek;
    });

    const totalExpenses = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const balance = income - totalExpenses;

    const fixed = filtered.filter(e => e.type === 'fixed').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const variable = filtered.filter(e => e.type === 'variable').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const hormiga = filtered.filter(e => e.type === 'hormiga').reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const byCategory = categories.reduce((acc, cat) => {
      acc[cat] = filtered.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount), 0);
      return acc;
    }, {});

    return { totalExpenses, balance, fixed, variable, hormiga, byCategory, filtered };
  };

  return (
    <ExpenseContext.Provider value={{ 
      income, setIncome, 
      expenses, addExpense, deleteExpense, updateExpense,
      fixedConfig, addFixedConfig, deleteFixedConfig,
      categories,
      selectedMonth, setSelectedMonth,
      selectedWeek, setSelectedWeek,
      getTotals,
      isLoading
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
