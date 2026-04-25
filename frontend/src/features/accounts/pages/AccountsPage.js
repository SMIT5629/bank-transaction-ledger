import React, { useEffect, useState } from 'react';
import { accountService } from '../services/accountService';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'savings',
    initialBalance: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAll();
      setAccounts(response.data);
    } catch (err) {
      setError('Failed to load accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountService.create(formData);
      setFormData({ accountName: '', accountType: 'savings', initialBalance: '' });
      setShowForm(false);
      fetchAccounts();
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountService.delete(id);
        fetchAccounts();
      } catch (err) {
        setError('Failed to delete account');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading accounts...</div>;
  }

  return (
    <>
      <div className="header">
        <h1>Accounts</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="content-card">
          <h3>Create New Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Account Name</label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                required
                placeholder="e.g., Savings Account"
              />
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="credit">Credit</option>
                <option value="investment">Investment</option>
              </select>
            </div>
            <div className="form-group">
              <label>Initial Balance</label>
              <input
                type="number"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <button type="submit" className="btn-primary">
              Create Account
            </button>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="card-title">
          <h2>Your Accounts</h2>
        </div>
        {accounts.length > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account._id}>
                    <td>{account.accountName}</td>
                    <td>{account.accountNumber}</td>
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
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => handleDelete(account._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No accounts yet</h3>
            <p>Create your first account to get started</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountsPage;
