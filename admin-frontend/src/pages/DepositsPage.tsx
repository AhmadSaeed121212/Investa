import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const load = () => api.pendingDeposits().then((r) => setDeposits(r.data.deposits || []));
  useEffect(() => { load().catch(console.error); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Deposits</h1>
      {deposits.map((d) => (
        <div key={d._id} className="glass-card p-3 flex justify-between items-center">
          <div>{d.user?.name} - ${d.amountUSD} - {d.transactionId}</div>
          <div className="space-x-2">
            <Button onClick={async()=>{await api.reviewDeposit(d._id,'APPROVE'); await load();}}>Approve</Button>
            <Button variant="destructive" onClick={async()=>{await api.reviewDeposit(d._id,'REJECT','Rejected by admin'); await load();}}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
