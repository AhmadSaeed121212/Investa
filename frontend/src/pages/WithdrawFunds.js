import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api';
import './WithdrawFunds.css';

const WithdrawFunds = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [history, setHistory] = useState([]);
  const [amountUSD, setAmountUSD] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const load = async () => {
    const [methods, withdrawals] = await Promise.all([api.paymentMethods(), api.myWithdrawals()]);
    setPaymentMethods(methods.data.methods || []);
    setHistory(withdrawals.data.withdrawals || []);
  };
  useEffect(() => { load().catch(console.error); }, []);

  const submit = async () => {
    try {
      await api.createWithdrawal({ amountUSD, withdrawAddress, paymentMethodId });
      alert('Withdrawal requested');
      setAmountUSD(''); setWithdrawAddress(''); setPaymentMethodId('');
      await load();
    } catch (e) { alert(e.message); }
  };

  return (
    <Layout title="Withdraw">
      <div className="p-4 dashboard-card">
        <input className="amount-input mb-2" placeholder="Amount" value={amountUSD} onChange={(e)=>setAmountUSD(e.target.value)} />
        <input className="amount-input mb-2" placeholder="Withdraw address" value={withdrawAddress} onChange={(e)=>setWithdrawAddress(e.target.value)} />
        <select className="filter-dropdown mb-2" value={paymentMethodId} onChange={(e)=>setPaymentMethodId(e.target.value)}>
          <option value="">Select payment method</option>
          {paymentMethods.map((m)=> <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <button className="btn-withdraw" onClick={submit}>Submit Withdrawal</button>
        <h5 className="text-white mt-4">Withdrawal History</h5>
        <ul>{history.map((w)=><li key={w._id} className="text-gray">${w.amountUSD} - {w.status}</li>)}</ul>
      </div>
    </Layout>
  );
};

export default WithdrawFunds;
