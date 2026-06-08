import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { getLocalOperations, saveLocalOperations } from './localStore';

function opsCollection(userId) {
  return collection(db, 'operations');
}

export function subscribeOperations(userId, onData, onError) {
  if (!userId) {
    onData([]);
    return () => {};
  }

  if (!isFirebaseConfigured) {
    onData(getLocalOperations(userId));
    return () => {};
  }

  const q = query(opsCollection(userId), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      onData(items);
    },
    onError,
  );
}

export async function createOperation(userId, data) {
  const payload = { ...data, userId };

  if (!isFirebaseConfigured) {
    const list = getLocalOperations(userId);
    const op = { id: crypto.randomUUID(), ...payload };
    saveLocalOperations(userId, [op, ...list]);
    return op.id;
  }

  const ref = await addDoc(opsCollection(userId), payload);
  return ref.id;
}

export async function updateOperation(userId, id, data) {
  if (!isFirebaseConfigured) {
    const list = getLocalOperations(userId).map((op) =>
      op.id === id ? { ...op, ...data } : op,
    );
    saveLocalOperations(userId, list);
    return;
  }

  await updateDoc(doc(db, 'operations', id), data);
}

export async function deleteOperation(userId, id) {
  if (!isFirebaseConfigured) {
    const list = getLocalOperations(userId).filter((op) => op.id !== id);
    saveLocalOperations(userId, list);
    return;
  }

  await deleteDoc(doc(db, 'operations', id));
}
