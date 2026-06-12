import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategoryIcon, getCategoryLabel } from '../utils/categories';
import { formatDate, formatMoney } from '../utils/format';

export default function OperationList({ operations, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  if (operations.length === 0) {
    return null;
  }

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ul className="op-list">
      {operations.map((op) => (
        <li key={op.id} className={`op-item ${op.type}`}>
          <div className="op-icon" aria-hidden="true">
            {op.type === 'income' ? '↑' : getCategoryIcon(op.category)}
          </div>
          <div className="op-body">
            <div className="op-main">
              <span className="op-type">
                {op.type === 'income' ? 'Доход' : getCategoryLabel(op.category)}
              </span>
              <strong className={op.type === 'income' ? 'income' : 'expense'}>
                {op.type === 'income' ? '+' : '−'}
                {formatMoney(Number(op.amount))}
              </strong>
            </div>
            <div className="op-meta">
              <span>{formatDate(op.date)}</span>
              {op.comment && <span className="op-comment">{op.comment}</span>}
            </div>
            <div className="op-actions">
              <Link to={`/operation/${op.id}/edit`} className="btn-text">
                Изменить
              </Link>
              <button
                type="button"
                className="btn-text danger"
                disabled={deletingId === op.id}
                onClick={() => handleDelete(op.id)}
              >
                {deletingId === op.id ? 'Удаление…' : 'Удалить'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
