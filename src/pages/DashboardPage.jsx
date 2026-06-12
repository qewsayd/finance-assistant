import { useState } from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import CategoryChart from '../components/CategoryChart';
import EmptyState from '../components/EmptyState';
import MonthPicker from '../components/MonthPicker';
import OperationList from '../components/OperationList';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import { useOperations } from '../hooks/useOperations';
import { getCategoryIcon, getCategoryLabel } from '../utils/categories';
import { formatMoney, monthKey } from '../utils/format';

export default function DashboardPage() {
  const [month, setMonth] = useState(monthKey());
  const { confirm } = useConfirm();
  const { show } = useToast();
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
    const ok = await confirm({
      title: 'Удалить операцию?',
      message: 'Это действие нельзя отменить.',
      confirmLabel: 'Удалить',
    });
    if (!ok) return;
    await remove(id);
    show('Операция удалена', 'success');
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Бюджет</h1>
          <p className="page-subtitle">Обзор за выбранный месяц</p>
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
          <BalanceCard balance={balance} income={income} expense={expense} />

          {monthOps.length === 0 && (
            <EmptyState
              icon="💰"
              title="Пока нет операций"
              text="Добавьте первый доход или расход, чтобы увидеть баланс и статистику."
              actionLabel="Добавить операцию"
              actionTo="/operation/new"
            />
          )}

          {expense > 0 && (
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
                    <span>
                      {getCategoryIcon(id)} {getCategoryLabel(id)}
                    </span>
                    <strong>{formatMoney(sum)}</strong>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recent.length > 0 && (
            <section className="panel">
              <div className="panel-head">
                <h2>Последние операции</h2>
                <Link to="/history" className="btn-text">
                  Вся история →
                </Link>
              </div>
              <OperationList operations={recent} onDelete={handleDelete} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
