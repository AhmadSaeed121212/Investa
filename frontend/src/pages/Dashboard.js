import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ walletBalance: 0, totalInvested: 0, totalEarnings: 0, totalReferralEarning: 0 });

  useEffect(() => {
    api.wallet().then((r)=>setWallet(r.data)).catch(console.error);
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="p-4">
        <div className="row g-3">
          <div className="col-md-3"><div className="stat-card"><p className="text-gray">Wallet</p><h4 className="text-white">${wallet.walletBalance?.toFixed(2)}</h4></div></div>
          <div className="col-md-3"><div className="stat-card"><p className="text-gray">Invested</p><h4 className="text-white">${wallet.totalInvested?.toFixed(2)}</h4></div></div>
          <div className="col-md-3"><div className="stat-card"><p className="text-gray">Earnings</p><h4 className="text-white">${wallet.totalEarnings?.toFixed(2)}</h4></div></div>
          <div className="col-md-3"><div className="stat-card"><p className="text-gray">Referral</p><h4 className="text-white">${wallet.totalReferralEarning?.toFixed(2)}</h4></div></div>
        </div>
        <button className="btn-deposit mt-4 me-2" onClick={() => navigate('/add-funds')}>Deposit</button>
        <button className="btn-withdraw mt-4" onClick={() => navigate('/withdraw-funds')}>Withdraw</button>
      </div>
    </Layout>
  );
};

export default Dashboard;
