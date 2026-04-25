import React, { useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    sortBy: '-createdAt',
  });
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    type: 'transfer',
    description: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll(filters);
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionService.create(formData);
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        type: 'transfer',
        description: '',
      });
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      setError('Failed to create transaction');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <>
      <div className="header">
        <h1>Transactions</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Transaction'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="content-card">
          <h3>Create New Transaction</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
              >
                <option value="transfer">Transfer</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="payment">Payment</option>
              </select>
            </div>
            <div className="form-group">
              <label>From Account</label>
              <input
                type="text"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleFormChange}
                placeholder="Account number or ID"
              />
            </div>
            {formData.type === 'transfer' && (
              <div className="form-group">
                <label>To Account</label>
                <input
                  type="text"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleFormChange}
                  placeholder="Recipient account number"
                />
              </div>
            )}
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleFormChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Transaction details"
              />
            </div>
            <button type="submit" className="btn-primary">
              Create Transaction
            </button>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="card-title">
          <h2>All Transactions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="payment">Payment</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        {transactions.length > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td>{transaction.fromAccount}</td>
                    <td>{transaction.toAccount || '-'}</td>
                    <td>
                      <span className="badge badge-primary">
                        {transaction.type}
                      </span>
                    </td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Create your first transaction to get started</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
