import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const nav = [
  { to: '/', label: 'Бюджет', end: true },
  { to: '/history', label: 'История' },
  { to: '/statistics', label: 'Статистика' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">₽</span>
          <div>
            <strong>ФинПомощник</strong>
            <small>учёт личного бюджета</small>
          </div>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn-text" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <nav className="app-nav">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/operation/new" className="btn-primary nav-add">
          + Операция
        </NavLink>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        Учебный дневник бюджета. Не является финансовой или инвестиционной
        рекомендацией.
      </footer>
    </div>
  );
}
