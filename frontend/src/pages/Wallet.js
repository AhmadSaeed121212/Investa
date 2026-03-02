import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api';
import './Wallet.css';

const Wallet = () => {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [wallet, setWallet] = useState({ walletBalance: 0, totalReferralEarning: 0 });
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [w, l] = await Promise.all([api.wallet(), api.walletLedger()]);
        setWallet(w.data);
        setLedger(l.data.items || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <Layout title="Wallet">
      <div className="p-4">
        <div className="balance-card mb-4">
          <h2 className="balance-amount">{balanceVisible ? `$${(wallet.walletBalance || 0).toFixed(2)}` : '****'}</h2>
          <p className="text-gray">Referral Earning: ${(wallet.totalReferralEarning || 0).toFixed(2)}</p>
          <button className="btn-dashboard me-2" onClick={() => navigate('/add-funds')}>Deposit</button>
          <button className="btn-dashboard" onClick={() => navigate('/withdraw-funds')}>Withdraw</button>
          <button className="btn-dashboard ms-2" onClick={() => setBalanceVisible((v) => !v)}>Toggle</button>
        </div>

        <div className="dashboard-card">
          <h5 className="text-white mb-3">Recent Activity</h5>
          <div className="table-responsive">
            <table className="custom-table">
              <thead><tr><th>Type</th><th>Amount</th><th>Direction</th></tr></thead>
              <tbody>
                {ledger.length ? ledger.map((row) => (
                  <tr key={row._id}><td>{row.type}</td><td>${Number(row.amount).toFixed(2)}</td><td>{row.direction}</td></tr>
                )) : <tr><td colSpan="3" className="text-center">No transaction history found!</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
