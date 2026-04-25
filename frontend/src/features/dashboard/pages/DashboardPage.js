import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentTransactions(5),
        ]);
        setStats(statsRes.data);
        setRecentTransactions(transRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1>Dashboard</h1>
      </div>

      {stats && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">
              ${stats.totalBalance?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-label">Total Accounts</div>
            <div className="stat-value">{stats.totalAccounts || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Month Income</div>
            <div className="stat-value">
              ${stats.monthlyIncome?.toFixed(2) || '0.00'}
            </div>
            <div className="stat-change">↑ Income</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-label">This Month Expense</div>
            <div className="stat-value">
              ${stats.monthlyExpense?.toFixed(2) || '0.00'}
            </div>
            <div className="stat-change negative">↓ Expense</div>
          </div>
        </div>
      )}

      <div className="content-card">
        <div className="card-title">
          <h2>Recent Transactions</h2>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td>{transaction.accountNumber}</td>
                    <td>
                      <span className="badge badge-primary">
                        {transaction.type}
                      </span>
                    </td>
                    <td>${transaction.amount.toFixed(2)}</td>
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
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
