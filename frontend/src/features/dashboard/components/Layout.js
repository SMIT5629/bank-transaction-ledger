import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { authService } from '../../auth/services/authService';
import '../styles/dashboard.css';

const Layout = ({ children, isSidebar = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!isSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Bank Ledger</h3>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li>
              <Link to="/dashboard" className={isActive('/dashboard')}>
                <span className="sidebar-icon">📊</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/accounts" className={isActive('/accounts')}>
                <span className="sidebar-icon">💳</span>
                Accounts
              </Link>
            </li>
            <li>
              <Link to="/transactions" className={isActive('/transactions')}>
                <span className="sidebar-icon">💰</span>
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/profile" className={isActive('/profile')}>
                <span className="sidebar-icon">👤</span>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="user-menu" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar">
              {user?.firstName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {user?.email}
              </div>
            </div>
          </div>
          {showUserMenu && (
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
