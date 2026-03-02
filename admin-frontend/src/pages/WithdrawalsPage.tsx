import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Withdrawal {
  id: string;
  user: string;
  amount: number;
  method: string;
  wallet: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const initialWithdrawals: Withdrawal[] = [
  { id: "WTH001", user: "John Doe", amount: 1200, method: "TRC20", wallet: "TXabc...xyz", status: "Pending", date: "2024-01-15 14:00" },
  { id: "WTH002", user: "Sarah Wilson", amount: 3500, method: "Bank", wallet: "ACC-1234567", status: "Approved", date: "2024-01-15 11:00" },
  { id: "WTH003", user: "Emily Davis", amount: 800, method: "JazzCash", wallet: "0300-1234567", status: "Approved", date: "2024-01-14 16:30" },
  { id: "WTH004", user: "Alex Brown", amount: 2000, method: "BEP20", wallet: "0xdef...789", status: "Rejected", date: "2024-01-14 09:15" },
  { id: "WTH005", user: "Lisa Anderson", amount: 5000, method: "TRC20", wallet: "TXmno...pqr", status: "Pending", date: "2024-01-13 13:45" },
];

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);

  const loadWithdrawals = async () => {
    try {
      const res = await api.pendingWithdrawals();
      const mapped = (res.data.withdrawals || []).map((w: any) => ({
        id: w._id, user: w.user?.name || "Unknown", email: w.user?.email || "-", amount: Number(w.amountUSD || 0),
        method: w.paymentMethodId?.name || "-", wallet: w.withdrawAddress, status: w.status === "PENDING" ? "Pending" : w.status === "PAID" ? "Approved" : "Rejected", date: new Date(w.createdAt).toLocaleString()
      }));
      setWithdrawals(mapped);
    } catch {}
  };

  useEffect(() => { loadWithdrawals(); }, []);
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const handleApprove = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "Approved" as const } : w));
    setSelected(null);
    toast({ title: "Approved", description: `Withdrawal ${id} approved` });
  };

  const handleReject = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "Rejected" as const } : w));
    setRejectDialog(null);
    setRejectNote("");
    setSelected(null);
    toast({ title: "Rejected", description: `Withdrawal ${id} rejected` });
  };

  const renderTable = (data: Withdrawal[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-b border-border bg-secondary/30">
            <th className="text-left py-3 px-3 md:px-4 font-medium">ID</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">User</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">Amount</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium hidden md:table-cell">Method</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium hidden lg:table-cell">Wallet</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">Status</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(w => (
            <tr key={w.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
              <td className="py-3 px-3 md:px-4 font-mono text-xs text-muted-foreground">{w.id}</td>
              <td className="py-3 px-3 md:px-4 text-foreground">{w.user}</td>
              <td className="py-3 px-3 md:px-4 text-foreground font-medium">${w.amount.toLocaleString()}</td>
              <td className="py-3 px-3 md:px-4 text-muted-foreground hidden md:table-cell">{w.method}</td>
              <td className="py-3 px-3 md:px-4 font-mono text-xs text-muted-foreground hidden lg:table-cell">{w.wallet}</td>
              <td className="py-3 px-3 md:px-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  w.status === "Approved" ? "bg-success/10 text-success" :
                  w.status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                }`}>{w.status}</span>
              </td>
              <td className="py-3 px-3 md:px-4">
                <div className="flex gap-1">
                  <button onClick={() => setSelected(w)} className="p-1.5 hover:bg-secondary rounded"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                  {w.status === "Pending" && (
                    <>
                      <button onClick={() => handleApprove(w.id)} className="p-1.5 hover:bg-success/20 rounded"><CheckCircle className="w-4 h-4 text-success" /></button>
                      <button onClick={() => setRejectDialog(w.id)} className="p-1.5 hover:bg-destructive/20 rounded"><XCircle className="w-4 h-4 text-destructive" /></button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-sm">No withdrawals found</td></tr>}
        </tbody>
      </table>
    </div>
  );

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
