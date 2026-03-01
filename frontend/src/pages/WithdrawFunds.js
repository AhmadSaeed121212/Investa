import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import './WithdrawFunds.css';

const WithdrawFunds = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [successMsg, setSuccessMsg] = useState(false);

  const paymentMethods = [
    { id: 'TRON (TRC 20)', name: 'TRON (TRC 20)', icon: 'fab fa-bitcoin', bgColor: 'bg-crypto' },
    { id: 'BSC (BEP 20)', name: 'BSC (BEP 20)', icon: 'fas fa-university', bgColor: 'bg-bank' }
  ];

  useEffect(() => {
    loadWithdrawHistory();
  }, [filterPeriod]);

  useEffect(() => {
    // Add floating animation to cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
  }, []);

  const loadWithdrawHistory = () => {
    const history = JSON.parse(localStorage.getItem('withdrawHistory') || '[]');
    const filtered = filterHistory(history, filterPeriod);
    setWithdrawHistory(filtered);
  };

  const filterHistory = (history, period) => {
    const now = new Date();
    if (period === 'all') return history;

    const days = parseInt(period);
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    return history.filter(withdraw => {
      const withdrawDate = new Date(withdraw.date);
      return withdrawDate >= cutoffDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleContinueWithdraw = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    const amountValue = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    if (!withdrawAddress.trim()) {
      alert('Please enter your withdraw address');
      return;
    }

    const history = JSON.parse(localStorage.getItem('withdrawHistory') || '[]');
    history.push({
      method: selectedMethod,
      amount: amountValue,
      address: withdrawAddress,
      status: 'Requested',
      date: new Date().toISOString()
    });
    localStorage.setItem('withdrawHistory', JSON.stringify(history));

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2500);

    // Clear fields
    setWithdrawAmount('');
    setWithdrawAddress('');
    setSelectedMethod('');
    loadWithdrawHistory();
  };

  const handleAmountInput = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      value = parts[0] + '.' + parts[1];
    }
    setWithdrawAmount(value);
  };

  return (
    <Layout title="Withdraw">
      <div className="row g-4 withdraw-sections-row">
        {/* Withdrawal Instructions */}
        <div className="col-12 withdraw-instructions-col">
          <div className="dashboard-card mb-4">
            <h5 className="text-white mb-4">Withdrawal Instructions</h5>
            <ul className="instruction-list">
              <li>Double-check your wallet or account details before submitting a withdrawal request. Incorrect details may result in permanent loss of funds.</li>
              <li>Withdrawals are typically processed within <strong>24 hours</strong> on business days. Delays may occur during weekends or holidays.</li>
            </ul>
          </div>
        </div>

        {/* Select Payment Method + Withdraw Amount */}
        <div className="col-12 withdraw-form-col">
          {/* Select Payment Method */}
          <div className="dashboard-card mb-4">
            <h5 className="text-white mb-4">Select Payment Method</h5>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-card ${selectedMethod === method.id ? 'active' : ''}`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className={`payment-icon ${method.bgColor}`}>
                  <i className={`${method.icon} text-white`}></i>
                </div>
                <span className="text-white">{method.name}</span>
              </div>
            ))}
          </div>

          {/* Withdraw Amount */}
          <div className="dashboard-card">
            <h5 className="text-white mb-4">Withdraw Amount</h5>
            <div className="position-relative mb-4">
              <span className="position-absolute text-gray" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>$</span>
              <input
                type="text"
                className="amount-input ps-5"
                placeholder="Enter withdrawal amount"
                value={withdrawAmount}
                onChange={handleAmountInput}
              />
            </div>
            <div className="position-relative mb-4">
              <input
                type="text"
                className="amount-input"
                placeholder="Enter your withdraw address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
              />
            </div>

            <button className="btn-withdraw" onClick={handleContinueWithdraw}>
              Continue Withdraw
            </button>

            {successMsg && (
              <div className="mt-3 text-center" style={{ color: '#10b981', fontWeight: '700' }}>
                Request sent successfully
              </div>
            )}
          </div>
        </div>

        {/* Withdraw History */}
        <div className="col-12 withdraw-history-col">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white mb-0">Withdraw History</h5>
              <div className="d-flex gap-2">
                <button className="btn btn-link text-white p-2" style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '10px', transition: 'all 0.3s' }}>
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
            {withdrawHistory.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="fas fa-receipt text-gray fs-1 opacity-50"></i>
                </div>
                <p className="text-gray mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>No transaction history found!</p>
                <p className="text-gray small mb-0 mt-2" style={{ opacity: 0.7 }}>Your withdrawal history will appear here</p>
              </div>
            ) : (
              <div className="row g-3">
                {withdrawHistory.map((withdraw, index) => (
                  <div key={index} className="col-12">
                    <div className="d-flex justify-content-between align-items-center p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>
                        <div className="text-white fw-medium">${withdraw.amount.toFixed(2)}</div>
                        <small className="text-gray">{withdraw.method}</small>
                      </div>
                      <div className="text-end">
                        <div className={withdraw.status === 'Completed' ? 'text-success' : withdraw.status === 'Requested' ? 'text-warning' : 'text-danger'}>{withdraw.status}</div>
                        <small className="text-gray">{formatDate(withdraw.date)}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WithdrawFunds;
