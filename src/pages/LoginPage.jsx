import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loginWithGoogle, error, clearError, isFirebaseConfigured } =
    useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch {
      /* error in context */
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    clearError();
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch {
      /* error in context */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-top">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon lg">₽</span>
          <h1>ФинПомощник</h1>
          <p>Войдите, чтобы вести учёт доходов и расходов</p>
        </div>

        {!isFirebaseConfigured && (
          <p className="banner info">
            Firebase не настроен — работает локальное хранилище. Для Google
            войдите с демо-аккаунтом или добавьте ключи в <code>.env</code>.
          </p>
        )}

        {error && <p className="banner error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <button
          type="button"
          className="btn-google"
          onClick={handleGoogle}
          disabled={submitting}
        >
          <span className="google-icon">G</span>
          Войти через Google
        </button>

        <p className="auth-switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
