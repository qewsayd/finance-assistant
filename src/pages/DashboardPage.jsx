import { useState } from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import CategoryChart from '../components/CategoryChart';
import MonthPicker from '../components/MonthPicker';
import OperationList from '../components/OperationList';
import { useOperations } from '../hooks/useOperations';
import { getCategoryLabel } from '../utils/categories';
import { formatMoney, monthKey } from '../utils/format';

export default function DashboardPage() {
  const [month, setMonth] = useState(monthKey());
  const {
    monthOps,
    loading,
    error,
    income,
    expense,
    balance,
    byCategory,
    remove,
  } = useOperations(month);

  const recent = monthOps.slice(0, 5);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту операцию?')) return;
    await remove(id);
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Бюджет</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {error && <p className="banner error">{error}</p>}
      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <BalanceCard balance={balance} income={income} expense={expense} />

          <section className="panel">
            <div className="panel-head">
              <h2>Расходы по категориям</h2>
              <Link to="/statistics" className="btn-text">
                Подробнее →
              </Link>
            </div>
            <CategoryChart byCategory={byCategory} />
            <ul className="category-totals">
              {Object.entries(byCategory).map(([id, sum]) => (
                <li key={id}>
                  <span>{getCategoryLabel(id)}</span>
                  <strong>{formatMoney(sum)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Последние операции</h2>
              <Link to="/history" className="btn-text">
                Вся история →
              </Link>
            </div>
            <OperationList operations={recent} onDelete={handleDelete} />
          </section>
        </>
      )}
    </div>
  );
}
