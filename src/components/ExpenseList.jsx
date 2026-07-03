function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <section className="card list-card">
        <h2>Recent Expenses</h2>
        <p className="empty-state">Loading expenses...</p>
      </section>
    );
  }

  if (expenses.length === 0) {
    return (
      <section className="card list-card">
        <h2>Recent Expenses</h2>
        <p className="empty-state">No expenses yet. Add your first one above.</p>
      </section>
    );
  }

  return (
    <section className="card list-card">
      <h2>Recent Expenses</h2>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <div className="expense-info">
              <span className="expense-description">{expense.description}</span>
              <span className="expense-meta">
                <span className="category-badge">{expense.categoryName}</span>
                <span className="expense-date">{formatDate(expense.expenseDate)}</span>
              </span>
            </div>
            <div className="expense-actions">
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => onEdit(expense)}
                title="Edit"
                aria-label={`Edit ${expense.description}`}
              >
                ✎
              </button>
              <button
                type="button"
                className="btn-icon btn-icon-danger"
                onClick={() => onDelete(expense.id)}
                title="Delete"
                aria-label={`Delete ${expense.description}`}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
