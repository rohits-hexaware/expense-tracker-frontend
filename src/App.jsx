import { useCallback, useEffect, useState } from 'react';
import { categoryApi, expenseApi } from './api/expenseApi';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import Header from './components/Header';
import './App.css';

const DEFAULT_CATEGORIES = [
  { name: 'Food', description: 'Groceries and dining' },
  { name: 'Transport', description: 'Travel and commute' },
  { name: 'Utilities', description: 'Bills and subscriptions' },
  { name: 'Entertainment', description: 'Leisure activities' },
  { name: 'Other', description: 'Miscellaneous expenses' },
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const [summaryYear, setSummaryYear] = useState(now.getFullYear());
  const [summaryMonth, setSummaryMonth] = useState(now.getMonth() + 1);

  const loadCategories = useCallback(async () => {
    let cats = await categoryApi.getAll();
    if (cats.length === 0) {
      await Promise.all(
        DEFAULT_CATEGORIES.map((cat) => categoryApi.create(cat))
      );
      cats = await categoryApi.getAll();
    }
    setCategories(cats);
    return cats;
  }, []);

  const loadExpenses = useCallback(async () => {
    const data = await expenseApi.getAll();
    setExpenses(data);
    return data;
  }, []);

  const loadSummary = useCallback(async (year, month) => {
    const data = await expenseApi.getMonthlySummary(year, month);
    setSummary(data);
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([
      loadExpenses(),
      loadSummary(summaryYear, summaryMonth),
    ]);
  }, [loadExpenses, loadSummary, summaryYear, summaryMonth]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError('');
        await loadCategories();
        await refreshData();
      } catch (err) {
        setError(
          err.message ||
            'Could not connect to the backend. Make sure ExpenseTracker-Backend is running on port 8080.'
        );
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [loadCategories, refreshData]);

  const handleMonthChange = async (year, month) => {
    setSummaryYear(year);
    setSummaryMonth(month);
    try {
      await loadSummary(year, month);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (data) => {
    if (editingExpense) {
      await expenseApi.update(editingExpense.id, data);
      setEditingExpense(null);
    } else {
      await expenseApi.create(data);
    }
    await refreshData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expenseApi.delete(id);
      if (editingExpense?.id === id) setEditingExpense(null);
      await refreshData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
            <button type="button" onClick={() => setError('')} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )}

        <div className="dashboard">
          <div className="dashboard-left">
            <ExpenseForm
              key={editingExpense?.id ?? 'new'}
              categories={categories}
              onSubmit={handleSubmit}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>

          <aside className="dashboard-right">
            <ExpenseSummary
              summary={summary}
              year={summaryYear}
              month={summaryMonth}
              onMonthChange={handleMonthChange}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
