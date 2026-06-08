const USERS_KEY = 'finance_users';
const OPS_KEY = 'finance_operations';
const SESSION_KEY = 'finance_session';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalUsers() {
  return read(USERS_KEY, []);
}

export function saveLocalUser(user) {
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  write(USERS_KEY, users);
}

export function findLocalUserByEmail(email) {
  return getLocalUsers().find((u) => u.email === email) ?? null;
}

export function getLocalSession() {
  return read(SESSION_KEY, null);
}

export function setLocalSession(user) {
  if (user) write(SESSION_KEY, user);
  else localStorage.removeItem(SESSION_KEY);
}

export function getLocalOperations(userId) {
  return read(OPS_KEY, []).filter((op) => op.userId === userId);
}

export function saveLocalOperations(userId, operations) {
  const all = read(OPS_KEY, []).filter((op) => op.userId !== userId);
  write(OPS_KEY, [...all, ...operations]);
}
