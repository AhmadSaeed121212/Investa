import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api';
import './InvestmentPlans.css';

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [amountByPlan, setAmountByPlan] = useState({});

  useEffect(() => { api.plans().then((r)=>setPlans(r.data.plans || [])).catch(console.error); }, []);

  const invest = async (planId) => {
    const amount = amountByPlan[planId];
    if (!amount) return alert('Enter amount');
    try {
      await api.invest({ planId, amount: Number(amount) });
      alert('Investment created');
    } catch (e) { alert(e.message); }
  };

  return (
    <Layout title="Investment Plans">
      <div className="p-4">
        {plans.map((p) => (
          <div className="dashboard-card mb-3" key={p._id}>
            <h5 className="text-white">{p.name}</h5>
            <p className="text-gray">${p.min} - ${p.max} | {p.dailyProfit}% daily | {p.duration} days</p>
            <input className="amount-input mb-2" placeholder="Amount" value={amountByPlan[p._id] || ''} onChange={(e)=>setAmountByPlan({...amountByPlan,[p._id]:e.target.value})} />
            <button className="btn-deposit" onClick={()=>invest(p._id)}>Invest</button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default InvestmentPlans;
