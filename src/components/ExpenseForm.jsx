import { useState } from 'react';

const EMPTY_FORM = {
  description: '',
  amount: '',
  expenseDate: new Date().toISOString().split('T')[0],
  categoryId: '',
};

export default function ExpenseForm({ categories, onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(
    editingExpense
      ? {
          description: editingExpense.description,
          amount: String(editingExpense.amount),
          expenseDate: editingExpense.expenseDate,
          categoryId: String(editingExpense.categoryId),
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (!form.categoryId) {
      setError('Please select a category.');
      return;
    }

    try {
      await onSubmit({
        description: form.description.trim(),
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        categoryId: Number(form.categoryId),
      });
      if (!editingExpense) {
        setForm({ ...EMPTY_FORM, expenseDate: new Date().toISOString().split('T')[0] });
      }
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card form-card">
      <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Groceries"
            value={form.description}
            onChange={handleChange}
            maxLength={255}
          />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="expenseDate">Date</label>
            <input
              id="expenseDate"
              name="expenseDate"
              type="date"
              value={form.expenseDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
