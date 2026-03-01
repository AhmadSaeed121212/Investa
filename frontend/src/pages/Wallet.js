import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './Wallet.css';

const Wallet = () => {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const balance = 0.00;
  const referralEarning = 0.00;

  const handleDeposit = () => {
    navigate('/add-funds');
  };

  const handleWithdraw = () => {
    navigate('/withdraw-funds');
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  return (
    <Layout title="Wallet">
      <div className="p-4">
        {/* Balance Card */}
        <div className="balance-card mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <p className="text-gray mb-2">Total Balance</p>
              <div className="d-flex align-items-center">
                <h2 className="balance-amount mb-0">
                  {balanceVisible ? `$${balance.toFixed(2)}` : '****'}
                </h2>
                <i className="fas fa-arrow-up text-success ms-3 fs-5"></i>
                <i 
                  className={`fas ${balanceVisible ? 'fa-eye-slash' : 'fa-eye'} text-gray ms-2 fs-5`}
                  onClick={toggleBalanceVisibility}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>
              <div className="d-flex align-items-center mt-3">
                <i className="fas fa-user-friends text-gray me-2"></i>
                <span className="text-gray">Referral Earning:</span>
                <span className="text-white fw-bold ms-2">${referralEarning.toFixed(2)}</span>
                <i className="fas fa-arrow-down text-danger ms-2"></i>
              </div>
            </div>
            <div className="d-flex gap-3 mt-3 mt-md-0">
              <button className="btn-dashboard" onClick={handleDeposit}>
                <i className="fas fa-arrow-up me-2"></i>Deposit
              </button>
              <button className="btn-dashboard" onClick={handleWithdraw}>
                <i className="fas fa-arrow-down me-2"></i>Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h5 className="text-white mb-0">Recent Activity</h5>
            <div className="d-flex gap-3">
              <div className="position-relative">
                <i className="fas fa-search position-absolute text-gray" style={{left: '12px', top: '50%', transform: 'translateY(-50%)'}}></i>
                <input 
                  type="text" 
                  className="search-box ps-5" 
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-dashboard py-2 px-3">
                <i className="fas fa-sliders-h"></i>
              </button>
              <select 
                className="filter-dropdown"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
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
                {/* Empty state */}
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <div className="py-5">
                      <p className="text-gray mb-0" style={{fontSize: '18px'}}>No transaction history found!</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
