import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const stats = [
    { icon: 'fas fa-hand-holding-usd', label: 'Total Invested', value: '$0.00', color: 'bg-orange' },
    { icon: 'fas fa-user-friends', label: 'Referral Earning', value: '$0.00', color: 'bg-purple' },
    { icon: 'fas fa-arrow-up', label: 'Total Deposit', value: '$0.00', color: 'bg-yellow' },
    { icon: 'fas fa-arrow-down', label: 'Total Withdrawn', value: '$0.00', color: 'bg-red' }
  ];

  return (
    <Layout title="Dashboard">
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-7">
          {/* Live Earning */}
          <div className="dashboard-card">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="text-white mb-0">Live Earning</h5>
              <span className="text-white mb-0 mt-3 d-block fs-10">
                Total Earning:<br />
                <span className="fw-bold text-white">$500.0</span>
              </span>
            </div>
            <p className="text-success small mb-3">Real time updates</p>
            <h2 className="text-white fw-bold">$0.000000</h2>
            <div className="d-flex gap-3 mt-4">
              <button className="btn-orange flex-fill">
                <i className="fas fa-play me-2"></i>Activate Now
              </button>
              <button 
                className="btn-teal flex-fill"
                onClick={() => navigate('/add-funds')}
              >
                <i className="fas fa-plus me-2"></i>Add Funds
              </button>
            </div>
          </div>
          <br />
          
          {/* Balance Card */}
          <div className="balance-card mb-3">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-gray mb-1">Total Balance</p>
                <div className="d-flex align-items-center">
                  <h2 className="balance-amount mb-0">
                    {balanceVisible ? '$0.00' : '****'}
                  </h2>
                  <i className="fas fa-arrow-up text-success ms-3"></i>
                  <i 
                    className={`fas ${balanceVisible ? 'fa-eye-slash' : 'fa-eye'} text-gray ms-2`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setBalanceVisible(!balanceVisible)}
                  ></i>
                </div>
              </div>
              <button 
                className="btn-deposit"
                onClick={() => navigate('/add-funds')}
              >
                Deposit
              </button>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <p className="text-gray mb-0">
                Deposit Wallet: <span className="text-white">$0.00</span>{' '}
                <i className="fas fa-arrow-down text-danger ms-1"></i>
              </p>
              <button 
                className="btn-withdraw"
                onClick={() => navigate('/withdraw-funds')}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-5">
          {/* Stats Grid */}
          <div className="row g-3 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-6">
                <div className="stat-card">
                  <div className="d-flex align-items-center mb-3">
                    <div className={`stat-icon ${stat.color} me-3`}>
                      <i className={`${stat.icon} text-white`}></i>
                    </div>
                  </div>
                  <p className="text-gray small mb-1">{stat.label}</p>
                  <h4 className="text-white fw-bold mb-0">{stat.value}</h4>
                </div>
              </div>
            ))}
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
              <input type="text" className="search-box ps-5" placeholder="Search" />
            </div>
            <button className="btn btn-link text-white p-2 professional-btn">
              <i className="fas fa-sliders-h"></i>
            </button>
            <select className="filter-dropdown">
              <option>3 Days</option>
              <option>7 Days</option>
              <option>30 Days</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Withdraw History</th>
                <th>Deposit History</th>
                <th>Earning Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="text-center py-5">
                  <div className="py-5">
                    <p className="text-gray mb-0" style={{ fontSize: '16px' }}>
                      No transaction history found!
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
