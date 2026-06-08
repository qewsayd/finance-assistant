import { useState } from 'react';
import MonthPicker from '../components/MonthPicker';
import OperationList from '../components/OperationList';
import { useOperations } from '../hooks/useOperations';
import { monthKey } from '../utils/format';

export default function HistoryPage() {
  const [month, setMonth] = useState(monthKey());
  const { monthOps, loading, error, remove } = useOperations(month);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту операцию?')) return;
    await remove(id);
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>История операций</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {error && <p className="banner error">{error}</p>}
      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : (
        <section className="panel">
          <OperationList operations={monthOps} onDelete={handleDelete} />
        </section>
      )}
    </div>
  );
}
