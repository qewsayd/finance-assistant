import { useState } from 'react';
import CategoryChart from '../components/CategoryChart';
import MonthPicker from '../components/MonthPicker';
import { useOperations } from '../hooks/useOperations';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { formatMoney, monthKey } from '../utils/format';

export default function StatisticsPage() {
  const [month, setMonth] = useState(monthKey());
  const { loading, error, expense, byCategory } = useOperations(month);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Статистика</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {error && <p className="banner error">{error}</p>}
      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <section className="panel stat-summary">
            <p>Всего расходов за месяц</p>
            <strong className="expense lg">{formatMoney(expense)}</strong>
          </section>

          <section className="panel">
            <h2>Круговая диаграмма</h2>
            <CategoryChart byCategory={byCategory} />
          </section>

          <section className="panel">
            <h2>Итог по категориям</h2>
            <table className="stat-table">
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Сумма</th>
                  <th>Доля</th>
                </tr>
              </thead>
              <tbody>
                {EXPENSE_CATEGORIES.map((cat) => {
                  const sum = byCategory[cat.id] || 0;
                  const share =
                    expense > 0 ? Math.round((sum / expense) * 100) : 0;
                  return (
                    <tr key={cat.id}>
                      <td>{cat.label}</td>
                      <td>{formatMoney(sum)}</td>
                      <td>{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
