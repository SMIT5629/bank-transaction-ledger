import React, { useState, useEffect } from 'react';
import { accountAPI, transactionAPI } from '../services/api';

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const accountsResponse = await accountAPI.getAccounts();
      const accountsList = accountsResponse.data;
      setAccounts(accountsList);

      // Calculate stats
      let totalBalance = 0;
      let allTransactions = [];

      for (const account of accountsList) {
        totalBalance += parseFloat(account.balance || 0);
        try {
          const transResponse = await transactionAPI.getTransactions(account.id);
          allTransactions = [...allTransactions, ...transResponse.data];
        } catch (err) {
          console.error(`Error fetching transactions for account ${account.id}:`, err);
        }
      }

      const recentTrans = allTransactions
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      setRecentTransactions(recentTrans);
      setStats({
        totalAccounts: accountsList.length,
        totalBalance: totalBalance.toFixed(2),
        totalTransactions: allTransactions.length,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Accounts</div>
          <div className="stat-value">{stats.totalAccounts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">${stats.totalBalance}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{stats.totalTransactions}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Your Accounts</h2>
        </div>
        {accounts.length === 0 ? (
          <div className="empty-state">
            <h3>No accounts yet</h3>
            <p>Create an account to get started</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountType}</td>
                  <td>${parseFloat(account.balance).toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${account.status === 'active' ? 'success' : 'warning'}`}>
                      {account.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions yet</h3>
            <p>Start by creating a transaction</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.transactionType}</td>
                  <td className={transaction.transactionType === 'debit' ? 'text-center' : 'text-center'}>
                    {transaction.transactionType === 'credit' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
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
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
