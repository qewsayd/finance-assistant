import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase';
import {
  createOperation,
  deleteOperation,
  subscribeOperations,
  updateOperation,
} from '../services/operations';
import { getLocalOperations } from '../services/localStore';
import { monthKey } from '../utils/format';

export function useOperations(selectedMonth) {
  const { user } = useAuth();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setOperations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeOperations(
      user.id,
      (data) => {
        setOperations(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Не удалось загрузить операции');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const month = selectedMonth || monthKey();

  const monthOps = operations.filter((op) => op.date?.startsWith(month));

  const income = monthOps
    .filter((op) => op.type === 'income')
    .reduce((sum, op) => sum + Number(op.amount), 0);

  const expense = monthOps
    .filter((op) => op.type === 'expense')
    .reduce((sum, op) => sum + Number(op.amount), 0);

  const balance = income - expense;

  const byCategory = monthOps
    .filter((op) => op.type === 'expense')
    .reduce((acc, op) => {
      const cat = op.category || 'other';
      acc[cat] = (acc[cat] || 0) + Number(op.amount);
      return acc;
    }, {});

  const refreshLocal = useCallback(() => {
    if (user && !isFirebaseConfigured) {
      setOperations(getLocalOperations(user.id));
    }
  }, [user]);

  const add = useCallback(
    async (data) => {
      await createOperation(user.id, data);
      refreshLocal();
    },
    [user, refreshLocal],
  );

  const update = useCallback(
    async (id, data) => {
      await updateOperation(user.id, id, data);
      refreshLocal();
    },
    [user, refreshLocal],
  );

  const remove = useCallback(
    async (id) => {
      await deleteOperation(user.id, id);
      refreshLocal();
    },
    [user, refreshLocal],
  );

  return {
    operations,
    monthOps,
    loading,
    error,
    income,
    expense,
    balance,
    byCategory,
    add,
    update,
    remove,
  };
}
