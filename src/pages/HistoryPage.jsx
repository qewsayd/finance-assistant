import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import MonthPicker from '../components/MonthPicker';
import OperationList from '../components/OperationList';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import { useOperations } from '../hooks/useOperations';
import { monthKey } from '../utils/format';

export default function HistoryPage() {
  const [month, setMonth] = useState(monthKey());
  const { confirm } = useConfirm();
  const { show } = useToast();
  const { monthOps, loading, error, remove } = useOperations(month);

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
          <h1>История операций</h1>
          <p className="page-subtitle">Все доходы и расходы за месяц</p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {error && <p className="banner error">{error}</p>}
      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : (
        <section className="panel">
          {monthOps.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Нет операций за этот месяц"
              text="Выберите другой месяц или добавьте новую запись."
              actionLabel="Добавить операцию"
              actionTo="/operation/new"
            />
          ) : (
            <OperationList operations={monthOps} onDelete={handleDelete} />
          )}
        </section>
      )}
    </div>
  );
}
