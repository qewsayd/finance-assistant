const MESSAGES = {
  'auth/email-already-in-use': 'Этот email уже зарегистрирован',
  'auth/invalid-email': 'Некорректный email',
  'auth/weak-password': 'Пароль слишком простой (минимум 6 символов)',
  'auth/user-not-found': 'Пользователь не найден',
  'auth/wrong-password': 'Неверный пароль',
  'auth/invalid-credential': 'Неверный email или пароль',
  'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
  'auth/popup-closed-by-user': 'Вход через Google отменён',
  'auth/popup-blocked': 'Всплывающее окно заблокировано браузером',
  'auth/network-request-failed': 'Нет подключения к интернету',
  'permission-denied': 'Нет доступа к данным. Проверьте правила Firestore',
};

export function mapFirebaseError(error) {
  const code = error?.code || '';
  return MESSAGES[code] || error?.message || 'Произошла ошибка';
}
