import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/projects" className="brand">
          Tekki
        </Link>
        <div className="topbar-actions">
          <span className="user-chip">{user?.name}</span>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="page">{children}</main>
    </div>
  );
}
