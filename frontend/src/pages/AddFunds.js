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

  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, dRes] = await Promise.all([api.paymentMethods(), api.myDeposits()]);
        const methods = (mRes.data.methods || []).map((m, i) => ({ id: m._id, name: m.name, icon: i % 2 ? 'fas fa-university' : 'fab fa-bitcoin', bgClass: i % 2 ? 'bg-bank' : 'bg-crypto' }));
        setPaymentMethods(methods);
        const history = (dRes.data.deposits || []).map((d) => ({ amount: d.amountUSD, method: d.paymentMethodId?.name || '-', status: d.status === 'PENDING' ? 'Pending' : d.status === 'APPROVED' ? 'Completed' : 'Rejected', date: d.createdAt, transactionId: d.transactionId }));
        setDepositHistory(history);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    // Generate new reference number when method/amount changes
    if (selectedMethod && amount) {
      const randomRef = 'TXN' + Math.floor(100000 + Math.random() * 900000);
      setReferenceNumber(randomRef);
    }
  }, [selectedMethod, amount]);

  const handleMethodSelect = (method) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid deposit amount first.');
      return;
    }
    setSelectedMethod(method);
    setShowQRBlock(true);
    

  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (!e.target.value) {
      setShowQRBlock(false);
      setSelectedMethod('');
    }
  };

  const copyReference = () => {
    navigator.clipboard.writeText(referenceNumber);
    alert('Reference number copied to clipboard!');
  };

  const handleCompleteDeposit = async () => {
    if (!transactionId.trim()) {
      alert('Please enter your transaction ID');
      return;
    }

    if (!screenshot) {
      alert('Please upload your payment screenshot');
      return;
    }

    try {
      const form = new FormData();
      form.append('amountUSD', amount);
      form.append('paymentMethodId', selectedMethod);
      form.append('transactionId', transactionId.trim());
      form.append('screenshot', screenshot);
      await api.createDeposit(form);
      const dRes = await api.myDeposits();
      const history = (dRes.data.deposits || []).map((d) => ({ amount: d.amountUSD, method: d.paymentMethodId?.name || '-', status: d.status === 'PENDING' ? 'Pending' : d.status === 'APPROVED' ? 'Completed' : 'Rejected', date: d.createdAt, transactionId: d.transactionId }));
      setDepositHistory(history);
      setAmount('');
      setSelectedMethod('');
      setShowQRBlock(false);
      setTransactionId('');
      setScreenshot(null);
      alert('Deposit submitted successfully!');
    } catch (e) {
      alert(e.message);
    }
  };

  const filterHistory = (history) => {
    if (historyFilter === 'all') return history;
    const days = parseInt(historyFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return history.filter(deposit => new Date(deposit.date) >= cutoffDate);
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
