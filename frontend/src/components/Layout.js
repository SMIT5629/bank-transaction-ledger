import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ userRole, onLogout, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Bank Ledger</div>

        {userRole === 'admin' ? (
          <>
            <ul className="sidebar-menu">
              <li>
                <Link to="/admin" className={isActive('/admin')}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className={isActive('/admin/users')}>
                  Users
                </Link>
              </li>
              <li>
                <Link to="/admin/transactions" className={isActive('/admin/transactions')}>
                  All Transactions
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul className="sidebar-menu">
              <li>
                <Link to="/dashboard" className={isActive('/dashboard')}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/accounts" className={isActive('/accounts')}>
                  Accounts
                </Link>
              </li>
              <li>
                <Link to="/transactions" className={isActive('/transactions')}>
                  Transactions
                </Link>
              </li>
            </ul>
          </>
        )}

        <div className="sidebar-divider"></div>

        <ul className="sidebar-menu">
          <li>
            <a href="#logout" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
