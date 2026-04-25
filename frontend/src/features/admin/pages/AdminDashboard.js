import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await adminService.getSystemStats();
      setStats(statsRes.data);

      if (activeTab === 'users') {
        const usersRes = await adminService.getAllUsers();
        setUsers(usersRes.data);
      } else if (activeTab === 'accounts') {
        const accountsRes = await adminService.getAllAccounts();
        setAccounts(accountsRes.data);
      } else if (activeTab === 'transactions') {
        const transRes = await adminService.getAllTransactions();
        setTransactions(transRes.data);
      }
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <>
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <div className="admin-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.totalUsers || 0}</div>
            <div className="stat-name">Total Users</div>
          </div>
          <div className="stat-item warning">
            <div className="stat-number">{stats.totalAccounts || 0}</div>
            <div className="stat-name">Total Accounts</div>
          </div>
          <div className="stat-item success">
            <div className="stat-number">{stats.totalTransactions || 0}</div>
            <div className="stat-name">Total Transactions</div>
          </div>
          <div className="stat-item danger">
            <div className="stat-number">
              ${stats.totalVolume?.toFixed(2) || '0.00'}
            </div>
            <div className="stat-name">Total Volume</div>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`admin-tab ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Accounts
        </button>
        <button
          className={`admin-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="content-card">
          <h2>System Overview</h2>
          <p>Welcome to the admin dashboard. Use the tabs above to manage users, accounts, and transactions.</p>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="content-card">
          <h2>Users Management</h2>
          {users.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`user-badge user-badge-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${user.status === 'active' ? 'success' : 'danger'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-secondary btn-sm">View</button>
                          <button className="btn-secondary btn-sm">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="content-card">
          <h2>Accounts Management</h2>
          {accounts.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Account Number</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account._id}>
                      <td>{account.accountNumber}</td>
                      <td>{account.owner?.firstName} {account.owner?.lastName}</td>
                      <td>
                        <span className="badge badge-primary">
                          {account.accountType}
                        </span>
                      </td>
                      <td>${account.balance.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${account.status === 'active' ? 'success' : 'danger'}`}>
                          {account.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-secondary btn-sm">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No accounts found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="content-card">
          <h2>Transactions Management</h2>
          {transactions.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      <td>{transaction.fromAccount}</td>
                      <td>{transaction.toAccount || '-'}</td>
                      <td>${transaction.amount.toFixed(2)}</td>
                      <td>
                        <span className="badge badge-primary">
                          {transaction.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
