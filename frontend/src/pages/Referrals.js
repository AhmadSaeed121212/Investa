import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api';
import './Referrals.css';

const Referrals = () => {
  const [summary, setSummary] = useState({ byLevel: [], total: 0 });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([api.referralSummary(), api.me()])
      .then(([s, me]) => { setSummary(s.data); setProfile(me.data.user); })
      .catch(console.error);
  }, []);

  const referralCode = profile?.referralCode || 'N/A';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  return (
    <Layout title="Referrals">
      <div className="p-4 dashboard-card">
        <h5 className="text-white">Referral Code: {referralCode}</h5>
        <p className="text-gray">Link: {referralLink}</p>
        <h6 className="text-white">Total Referral Earning: ${Number(summary.total || 0).toFixed(2)}</h6>
        <ul>{(summary.byLevel || []).map((l) => <li key={l._id} className="text-gray">Level {l._id}: ${Number(l.total).toFixed(2)}</li>)}</ul>
      </div>
    </Layout>
  );
};

export default Referrals;
