import { Link } from 'react-router-dom';
import { getCategoryLabel } from '../utils/categories';
import { formatDate, formatMoney } from '../utils/format';

export default function OperationList({ operations, onDelete }) {
  if (operations.length === 0) {
    return <p className="empty-msg">Операций за этот месяц пока нет.</p>;
  }

  return (
    <ul className="op-list">
      {operations.map((op) => (
        <li key={op.id} className={`op-item ${op.type}`}>
          <div className="op-main">
            <span className="op-type">
              {op.type === 'income' ? 'Доход' : 'Расход'}
            </span>
            <strong className={op.type === 'income' ? 'income' : 'expense'}>
              {op.type === 'income' ? '+' : '−'}
              {formatMoney(Number(op.amount))}
            </strong>
          </div>
          <div className="op-meta">
            <span>{formatDate(op.date)}</span>
            {op.type === 'expense' && (
              <span>{getCategoryLabel(op.category)}</span>
            )}
            {op.comment && <span className="op-comment">{op.comment}</span>}
          </div>
          <div className="op-actions">
            <Link to={`/operation/${op.id}/edit`} className="btn-text">
              Изменить
            </Link>
            <button
              type="button"
              className="btn-text danger"
              onClick={() => onDelete(op.id)}
            >
              Удалить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
