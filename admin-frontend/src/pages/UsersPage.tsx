import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [amount, setAmount] = useState<Record<string,string>>({});
  const load = () => api.users().then((r) => setUsers(r.data.users || []));
  useEffect(() => { load().catch(console.error); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      {users.map((u) => (
        <div key={u._id} className="glass-card p-3">
          <div className="flex justify-between"><div>{u.name} ({u.email})</div><div>Wallet: ${u.walletBalance?.toFixed(2)}</div></div>
          <div className="mt-2 space-x-2 flex items-center">
            <Button variant="outline" onClick={async()=>{await api.updateUserStatus(u._id,!u.isBlocked); await load();}}>{u.isBlocked ? 'Unblock' : 'Block'}</Button>
            <Input className="max-w-32" placeholder="Amount" value={amount[u._id]||''} onChange={(e)=>setAmount({...amount,[u._id]:e.target.value})} />
            <Button onClick={async()=>{await api.adjustWallet(u._id,Number(amount[u._id]||0),'CREDIT'); await load();}}>Add</Button>
            <Button variant="destructive" onClick={async()=>{await api.adjustWallet(u._id,Number(amount[u._id]||0),'DEBIT'); await load();}}>Deduct</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
