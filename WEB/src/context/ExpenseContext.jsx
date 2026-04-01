import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [income, setIncomeState] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [fixedConfig, setFixedConfigState] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('Marzo');
  const [selectedWeek, setSelectedWeek] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Servicios', 'Ocio', 'Otros'];
  const currentYear = new Date().getFullYear();

  // Load Fixed Concepts (Templates)
  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase.from('fixed_concepts').select('*');
      if (error) console.error('Error loading fixed concepts:', error);
      else setFixedConfigState(data || []);
    };
    fetchTemplates();
  }, []);

  // Load Monthly Data (Income & Expenses)
  useEffect(() => {
    const fetchMonthlyData = async () => {
      setIsLoading(true);
      
      // Load Income for the month
      const { data: configData, error: configError } = await supabase
        .from('monthly_configs')
        .select('income')
        .eq('month_name', selectedMonth)
        .eq('year', currentYear)
        .maybeSingle();
      
      if (configError && configError.code !== 'PGRST116') { // PGRST116 is 'no rows'
        console.error('Error loading income:', configError);
      }
      setIncomeState(configData?.income || 0);

      // Load Expenses
      const { data: expData, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .eq('month_name', selectedMonth)
        .eq('year', currentYear);
      
      if (expError) console.error('Error loading expenses:', expError);
      else setExpenses(expData || []);

      setIsLoading(false);
    };

    fetchMonthlyData();
  }, [selectedMonth, currentYear]);

  const setIncome = async (val) => {
    const newVal = parseFloat(val) || 0;
    setIncomeState(newVal);
    
    // Upsert income config
    const { error } = await supabase
      .from('monthly_configs')
      .upsert({ 
        month_name: selectedMonth, 
        year: currentYear, 
        income: newVal 
      }, { onConflict: 'month_name, year' });
    
    if (error) console.error('Error saving income:', error);
  };

  const addFixedConfig = async (item) => {
    const { data, error } = await supabase
      .from('fixed_concepts')
      .insert([{ ...item }])
      .select();

    if (error) console.error('Error adding fixed concept:', error);
    else if (data) setFixedConfigState([...fixedConfig, data[0]]);
  };

  const deleteFixedConfig = async (id) => {
    const { error } = await supabase.from('fixed_concepts').delete().eq('id', id);
    if (error) console.error('Error deleting fixed concept:', error);
    else setFixedConfigState(fixedConfig.filter(c => c.id !== id));
  };

  const addExpense = async (expense) => {
    // Derive month name and year from the actual date entered in the form
    const MONTH_NAMES = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    let expenseMonthName = selectedMonth;
    let expenseYear = currentYear;

    if (expense.date) {
      const parts = expense.date.split('-');
      expenseYear = parseInt(parts[0]);
      expenseMonthName = MONTH_NAMES[parseInt(parts[1]) - 1];
    }

    // Strip out fields that belong to fixed_concepts but shouldn't be saved as columns in expenses
    const { id, created_at, due_day, ...cleanExpense } = expense;

    const expenseData = {
      ...cleanExpense,
      month_name: expenseMonthName,
      year: expenseYear,
      is_paid: cleanExpense.is_paid !== undefined ? cleanExpense.is_paid : false
    };

    // Remote Save
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select();

    if (error) console.error('Error adding expense:', error);
    else if (data) setExpenses([...expenses, data[0]]);
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) console.error('Error deleting expense:', error);
    else setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = async (id, updatedFields) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updatedFields)
      .eq('id', id)
      .select();

    if (error) console.error('Error updating expense:', error);
    else if (data) setExpenses(expenses.map(e => e.id === id ? { ...e, ...data[0] } : e));
  };

    const getTotals = () => {
      const filtered = expenses.filter(e => {
        if (selectedWeek === 'Todas') return true;
        const day = new Date(e.date).getUTCDate(); 
        const week = Math.ceil(day / 7);
        return `Semana ${week}` === selectedWeek;
      });

      // ONLY count paid expenses for totals
      const paidExpenses = filtered.filter(e => e.is_paid === true);

      const totalExpenses = paidExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const balance = income - totalExpenses;

      const fixed = paidExpenses.filter(e => e.type === 'fixed').reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const variable = paidExpenses.filter(e => e.type === 'variable').reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const hormiga = paidExpenses.filter(e => e.type === 'hormiga').reduce((sum, e) => sum + parseFloat(e.amount), 0);

      const byCategory = categories.reduce((acc, cat) => {
        acc[cat] = paidExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount), 0);
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
