import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import './Transactions.css';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, [filterPeriod]);

  useEffect(() => {
    // Add floating animation to cards
    const cards = document.querySelectorAll('.dashboard-card, .stat-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
  }, []);

  const loadTransactions = () => {
    // Combine deposit and withdraw history
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const withdrawHistory = JSON.parse(localStorage.getItem('withdrawHistory') || '[]');
    
    let allTransactions = [
      ...depositHistory.map(t => ({ ...t, type: 'Deposit' })),
      ...withdrawHistory.map(t => ({ ...t, type: 'Withdraw' }))
    ];

    // Filter by period
    if (filterPeriod !== 'all') {
      const days = parseInt(filterPeriod);
      const cutoffDate = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));
      allTransactions = allTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= cutoffDate;
      });
    }

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by search term
    if (searchTerm) {
      allTransactions = allTransactions.filter(t => 
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.method && t.method.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTransactions(allTransactions);
  };

  useEffect(() => {
    loadTransactions();
  }, [searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateStats = () => {
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const withdrawHistory = JSON.parse(localStorage.getItem('withdrawHistory') || '[]');
    
    const totalDeposit = depositHistory.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalWithdrawn = withdrawHistory.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalEarning = 0; // This would come from investment earnings
    const referralEarning = 0; // This would come from referral system

    return {
      totalEarning,
      referralEarning,
      totalDeposit,
      totalWithdrawn
    };
  };

  const stats = calculateStats();

  return (
    <Layout title="Transactions">
      {/* Stats Row */}
      <div className="row g-4 mb-4">
        {/* Total Earning */}
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-orange">
                <i className="fas fa-dollar-sign text-white"></i>
              </div>
              <div>
                <p className="text-gray small mb-1">Total Earning</p>
                <h4 className="text-white fw-bold mb-0">${stats.totalEarning.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Referral Earning */}
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-purple">
                <i className="fas fa-user-friends text-white"></i>
              </div>
              <div>
                <p className="text-gray small mb-1">Referral Earning</p>
                <h4 className="text-white fw-bold mb-0">${stats.referralEarning.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Total Deposit */}
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-yellow">
                <i className="fas fa-arrow-up text-white"></i>
              </div>
              <div>
                <p className="text-gray small mb-1">Total Deposit</p>
                <h4 className="text-white fw-bold mb-0">${stats.totalDeposit.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Total Withdrawn */}
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-red">
                <i className="fas fa-arrow-down text-white"></i>
              </div>
              <div>
                <p className="text-gray small mb-1">Total Withdrawn</p>
                <h4 className="text-white fw-bold mb-0">${stats.totalWithdrawn.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h5 className="text-white fw-bold mb-0">Transaction History</h5>
          <div className="d-flex gap-3">
            <div className="position-relative">
              <i className="fas fa-search position-absolute text-gray" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
              <input
                type="text"
                className="search-box ps-5"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-link text-white p-2 professional-btn" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(68, 210, 246, 0.3)', borderRadius: '12px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <i className="fas fa-sliders-h"></i>
            </button>
            <select className="filter-dropdown" value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <div className="py-5">
                      <p className="text-gray mb-0" style={{ fontSize: '16px' }}>No transaction history found!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.type} {transaction.method ? `(${transaction.method})` : ''}</td>
                    <td>${parseFloat(transaction.amount || 0).toFixed(2)}</td>
                    <td className={transaction.status === 'Completed' ? 'text-success' : transaction.status === 'Requested' ? 'text-warning' : 'text-danger'}>
                      {transaction.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
