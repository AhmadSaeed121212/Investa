import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api';
import './Transactions.css';

const Transactions = () => {
  const [ledger, setLedger] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { api.walletLedger().then((r)=>setLedger(r.data.items || [])).catch(console.error); }, []);

  const filtered = useMemo(() => ledger.filter((l) => l.type.toLowerCase().includes(search.toLowerCase())), [ledger, search]);

  return (
    <Layout title="Transactions">
      <div className="p-4 dashboard-card">
        <input className="search-box mb-3" placeholder="Search type" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <table className="custom-table">
          <thead><tr><th>Type</th><th>Amount</th><th>Direction</th></tr></thead>
          <tbody>{filtered.length ? filtered.map((t)=><tr key={t._id}><td>{t.type}</td><td>${Number(t.amount).toFixed(2)}</td><td>{t.direction}</td></tr>) : <tr><td colSpan="3">No transaction history found!</td></tr>}</tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Transactions;
