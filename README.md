# ФинПомощник

Веб-приложение для учёта личных доходов и расходов. Проект для производственной практики (3 курс) по [техническому заданию](https://reunionrs.github.io/students/#course-3-apps/finance).

**Стек:** React 19, Vite, React Router, Firebase (Auth + Firestore), Recharts.

## Возможности

- Регистрация и вход (email / пароль)
- Вход через Google (Firebase Authentication)
- Главный экран: баланс, доходы и расходы за месяц
- Добавление дохода и расхода с датой и комментарием
- Категории: питание, транспорт, покупки, развлечения, другое
- История операций с фильтром по месяцу
- Статистика: итоги, круговая диаграмма, доли по категориям
- Редактирование и удаление операций
- Светлая и тёмная тема
- Данные отдельно для каждого пользователя
- Проверка: сумма операции > 0

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

Или дважды щёлкните `start.bat`.

## Настройка Firebase

### Автоматически (рекомендуется)

Дважды щёлкните **`setup-firebase.bat`** и введите ключи из Firebase Console.

### Вручную

1. Создайте проект на https://console.firebase.google.com/
2. **Authentication** → включите **Email/Password** и **Google**
3. **Firestore Database** → создайте базу
4. **Project settings** → Web app → скопируйте конфиг в `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

5. Задеплойте правила Firestore:

```bash
npx firebase login
npx firebase use ВАШ_PROJECT_ID
npm run firebase:rules
```

6. Перезапустите `npm run dev` — в шапке появится бейдж **☁️ Облако**.

### Правила Firestore

Файл `firestore.rules` уже в проекте. Каждый пользователь видит только свои операции.

## Деплой на Firebase Hosting

```bash
npm run firebase:hosting
```

## Сценарий проверки (из ТЗ)

1. Создать аккаунт и войти
2. Добавить доход и несколько расходов
3. Проверить баланс на главной
4. Открыть «Статистика» — диаграмма и итоги
5. Изменить и удалить операцию
6. Обновить страницу — данные сохранены
7. Войти через Google (при настроенном Firebase)
8. Переключить светлую/тёмную тему

## Структура

```
src/
  components/   — UI-компоненты
  context/      — авторизация, тема, уведомления
  hooks/        — операции и расчёты
  pages/        — экраны приложения
  services/     — Firestore / localStorage
  utils/        — категории, форматирование, ошибки Firebase
firestore.rules — правила безопасности
firebase.json   — конфиг Firebase
```

## GitHub

Репозиторий: https://github.com/qewsayd/finance-assistant

## Важно

Учебный дневник бюджета. Не используйте реальные банковские карты. Не даёт инвестиционных рекомендаций.
