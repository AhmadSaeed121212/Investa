import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function WithdrawalsPage() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => api.pendingWithdrawals().then((r) => setItems(r.data.withdrawals || []));
  useEffect(() => { load().catch(console.error); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Withdrawals</h1>
      {items.map((w) => (
        <div key={w._id} className="glass-card p-3 flex justify-between items-center">
          <div>{w.user?.name} - ${w.amountUSD} - {w.withdrawAddress}</div>
          <div className="space-x-2">
            <Button onClick={async()=>{await api.reviewWithdrawal(w._id,'APPROVE','',''); await load();}}>Approve</Button>
            <Button variant="destructive" onClick={async()=>{await api.reviewWithdrawal(w._id,'DENY','Denied by admin',''); await load();}}>Deny</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
