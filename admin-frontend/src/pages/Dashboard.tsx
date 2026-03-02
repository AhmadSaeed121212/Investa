import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState<any>({ stats: {}, recentTransactions: [] });

  useEffect(() => {
    api.dashboard().then((r) => setData(r.data)).catch(console.error);
  }, []);

  const s = data.stats || {};

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-card p-3">Users: {s.totalUsers || 0}</div>
        <div className="glass-card p-3">Pending Deposits: {s.pendingDeposits || 0}</div>
        <div className="glass-card p-3">Pending Withdrawals: {s.pendingWithdrawals || 0}</div>
        <div className="glass-card p-3">Approved Deposits: ${Number(s.approvedDepositsAmount || 0).toFixed(2)}</div>
        <div className="glass-card p-3">Paid Withdrawals: ${Number(s.paidWithdrawalsAmount || 0).toFixed(2)}</div>
      </div>
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-2">Recent Transactions</h3>
        {(data.recentTransactions || []).map((t: any) => (
          <div key={t._id} className="text-sm border-b border-border/30 py-1">{t.user?.name || 'User'} - {t.type} - ${Number(t.amount).toFixed(2)}</div>
        ))}
      </div>
    </div>
  );
}
