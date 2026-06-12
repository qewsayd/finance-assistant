import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { monthKey } from '../utils/format';
import { useToast } from '../context/ToastContext';
import { useOperations } from '../hooks/useOperations';

const today = () => new Date().toISOString().slice(0, 10);

export default function OperationFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { show } = useToast();
  const { operations, loading, add, update } = useOperations();

  const existing = isEdit ? operations.find((op) => op.id === id) : null;

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(today());
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setAmount(String(existing.amount));
      setCategory(existing.category || 'food');
      setDate(existing.date?.slice(0, 10) || today());
      setComment(existing.comment || '');
    }
  }, [existing]);

  const validate = () => {
    const num = Number(amount);
    if (!amount || Number.isNaN(num) || num <= 0) {
      setFormError('Сумма должна быть больше нуля');
      return false;
    }
    if (!date) {
      setFormError('Укажите дату');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      type,
      amount: Number(amount),
      date,
      comment: comment.trim(),
      category: type === 'expense' ? category : null,
      month: date.slice(0, 7) || monthKey(),
    };

    try {
      if (isEdit) {
        await update(id, payload);
        show('Операция обновлена', 'success');
      } else {
        await add(payload);
        show('Операция добавлена', 'success');
      }
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Не удалось сохранить операцию');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="page">
        <p className="banner error">Операция не найдена</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{isEdit ? 'Редактирование' : 'Новая операция'}</h1>
          <p className="page-subtitle">
            {type === 'income' ? 'Запись дохода' : 'Запись расхода'}
          </p>
        </div>
      </div>

      {formError && <p className="banner error">{formError}</p>}

      <form className="op-form panel" onSubmit={handleSubmit}>
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'income' ? 'active income' : ''}
            onClick={() => setType('income')}
          >
            ↑ Доход
          </button>
          <button
            type="button"
            className={type === 'expense' ? 'active expense' : ''}
            onClick={() => setType('expense')}
          >
            ↓ Расход
          </button>
        </div>

        <label>
          Сумма, ₽
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="1000"
            autoFocus
          />
        </label>

        <label>
          Дата
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {type === 'expense' && (
          <label>
            Категория
            <div className="category-grid">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </label>
        )}

        <label>
          Комментарий
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Например: зарплата, продукты, проездной…"
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Сохранение…' : 'Сохранить'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
