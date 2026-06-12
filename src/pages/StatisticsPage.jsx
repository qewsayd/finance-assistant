import { useState } from 'react';
import CategoryChart from '../components/CategoryChart';
import EmptyState from '../components/EmptyState';
import MonthPicker from '../components/MonthPicker';
import StatCards from '../components/StatCards';
import { useOperations } from '../hooks/useOperations';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { formatMoney, monthKey } from '../utils/format';

export default function StatisticsPage() {
  const [month, setMonth] = useState(monthKey());
  const { loading, error, income, expense, balance, byCategory } =
    useOperations(month);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Статистика</h1>
          <p className="page-subtitle">Анализ расходов по категориям</p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {error && <p className="banner error">{error}</p>}
      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <StatCards income={income} expense={expense} balance={balance} />

          {expense === 0 ? (
            <section className="panel">
              <EmptyState
                icon="📊"
                title="Нет расходов за месяц"
                text="Добавьте расходы, чтобы увидеть диаграмму и итоги по категориям."
                actionLabel="Добавить расход"
                actionTo="/operation/new"
              />
            </section>
          ) : (
            <>
              <section className="panel">
                <h2>Круговая диаграмма расходов</h2>
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
                          <td>
                            {cat.icon} {cat.label}
                          </td>
                          <td>{formatMoney(sum)}</td>
                          <td>
                            <div className="share-bar">
                              <span
                                className="share-fill"
                                style={{ width: `${share}%` }}
                              />
                              <span className="share-text">{share}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
