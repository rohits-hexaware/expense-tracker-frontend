function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount ?? 0);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function ExpenseSummary({ summary, year, month, onMonthChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <section className="card summary-card">
      <div className="summary-header">
        <h2>Monthly Summary</h2>
        <div className="summary-filters">
          <select
            value={month}
            onChange={(e) => onMonthChange(year, Number(e.target.value))}
            aria-label="Select month"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => onMonthChange(Number(e.target.value), month)}
            aria-label="Select year"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">{formatCurrency(summary?.totalAmount)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Expenses</span>
          <span className="stat-value">{summary?.expenseCount ?? 0}</span>
        </div>
      </div>
    </section>
  );
}
