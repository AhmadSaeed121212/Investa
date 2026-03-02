import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api';
import './AddFunds.css';

const AddFunds = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [showQRBlock, setShowQRBlock] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('TXN458921');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [depositHistory, setDepositHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const filteredHistory = filterHistory(depositHistory);

  return (
    <Layout title="Deposit">
      <div className="p-4">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-6">
            <div className="dashboard-card">
              <h5 className="text-white mb-4">Deposit</h5>

              {/* Amount */}
              <div className="mb-4">
                <label className="text-gray mb-2" style={{fontSize: '14px'}}>Amount</label>
                <div className="position-relative">
                  <span className="position-absolute text-gray" style={{left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px'}}>$</span>
                  <input 
                    type="text" 
                    className="amount-input ps-5" 
                    id="depositAmount" 
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="text-gray mb-2" style={{fontSize: '14px'}}>Select Payment Method</label>
                <div className="row" style={{marginTop: '40px'}}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="col-12 mb-3">
                      <div 
                        className={`payment-card ${selectedMethod === method.id ? 'active' : ''}`}
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        <div className={`payment-icon ${method.bgClass}`}>
                          <i className={`${method.icon} text-white`}></i>
                        </div>
                        <span className="text-white">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR + Transaction (shown after method select) */}
              {showQRBlock && (
                <div id="qrBlock" style={{borderTop: '1px solid rgba(148,163,184,0.3)', paddingTop: '18px', marginTop: '6px'}}>
                  <div className="qr-placeholder mb-3">
                    <i className="fas fa-qrcode"></i>
                  </div>
                  <h6 className="text-uppercase text-light text-center mb-2">RECEIPT</h6>

                  <h6 className="text-white mb-2 text-center">
                    Payment Method: <span id="paymentMethodDisplay">{selectedMethod}</span>
                  </h6>

                  <h4 className="text-primary-custom mb-3 text-center">
                    Amount: $<span id="depositAmountDisplay">{parseFloat(amount || 0).toFixed(2)}</span>
                  </h4>

                  <div className="text-gray mb-3 text-center">
                    Ref No: 
                    <span id="referenceNumberDisplay">{referenceNumber}</span>
                    <button className="btn btn-sm btn-outline-light ms-2" onClick={copyReference}>
                      Copy
                    </button>
                  </div>

                  <div className="mt-3">
                    <h6 className="text-white mb-3">Transaction Details</h6>
                    <div className="mb-3">
                      <input 
                        type="text" 
                        className="amount-input" 
                        id="transactionId" 
                        placeholder="Enter your transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                            handleCompleteDeposit();
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <input 
                        type="file" 
                        className="amount-input file-input" 
                        id="transactionScreenshot" 
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                      />
                    </div>
                    <button className="btn-deposit" onClick={handleCompleteDeposit}>
                      Complete Deposit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>               
          {/* Right Column */}
          <div className="col-lg-6">
            {/* Deposit Instructions */}
            <div className="dashboard-card mb-4">
              <h5 className="text-white mb-4">Deposit Instructions</h5>
              <ul className="instruction-list">
                <li>If the transfer time is up, please fill out the deposit form again.</li>
                <li>The amount you send must be the same as your order.</li>
                <li>Note: Don't cancel the deposit after sending the money.</li>
                <li>Minimum deposit is $2</li>
              </ul>
            </div>

            <div className="dashboard-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white mb-0">Deposit History</h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-link text-white p-2" style={{background: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}>
                    <i className="fas fa-sliders-h"></i>
                  </button>
                  <select 
                    className="filter-dropdown" 
                    id="historyFilter"
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                  >
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
              <div id="depositHistoryContainer">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-gray mb-0" style={{fontSize: '16px'}}>No transaction history found!</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {filteredHistory.map((deposit, index) => {
                      const statusClass = deposit.status === 'Completed' ? 'text-success' : 'text-warning';
                      return (
                        <div key={index} className="col-12">
                          <div className="d-flex justify-content-between align-items-center p-3" style={{background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div>
                              <div className="text-white fw-medium">${deposit.amount.toFixed(2)}</div>
                              <small className="text-gray">{deposit.method}</small>
                            </div>
                            <div className="text-end">
                              <div className={statusClass}>{deposit.status}</div>
                              <small className="text-gray">{formatDate(deposit.date)}</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddFunds;
