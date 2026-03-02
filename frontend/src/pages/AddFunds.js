import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api';
import './AddFunds.css';

const AddFunds = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [history, setHistory] = useState([]);

  const load = async () => {
    const [methods, deposits] = await Promise.all([api.paymentMethods(), api.myDeposits()]);
    setPaymentMethods(methods.data.methods || []);
    setHistory(deposits.data.deposits || []);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const submit = async () => {
    try {
      const form = new FormData();
      form.append('amountUSD', amountUSD);
      form.append('paymentMethodId', selectedMethod);
      form.append('transactionId', transactionId);
      form.append('screenshot', screenshot);
      await api.createDeposit(form);
      alert('Deposit submitted successfully');
      setAmountUSD(''); setSelectedMethod(''); setTransactionId(''); setScreenshot(null);
      await load();
    } catch (e) { alert(e.message); }
  };

  return (
    <Layout title="Deposit">
      <div className="p-4 dashboard-card">
        <input className="amount-input mb-2" placeholder="Amount" value={amountUSD} onChange={(e)=>setAmountUSD(e.target.value)} />
        <select className="filter-dropdown mb-2" value={selectedMethod} onChange={(e)=>setSelectedMethod(e.target.value)}>
          <option value="">Select payment method</option>
          {paymentMethods.map((m)=> <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <input className="amount-input mb-2" placeholder="Transaction ID" value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} />
        <input type="file" className="amount-input mb-3" accept="image/*" onChange={(e)=>setScreenshot(e.target.files?.[0] || null)} />
        <button className="btn-deposit" onClick={submit}>Submit Deposit</button>

        <h5 className="text-white mt-4">Deposit History</h5>
        <ul>{history.map((d)=><li key={d._id} className="text-gray">${d.amountUSD} - {d.status}</li>)}</ul>
      </div>
    </Layout>
  );
};

export default AddFunds;
