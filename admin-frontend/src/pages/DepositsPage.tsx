import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Deposit {
  id: string;
  user: string;
  amount: number;
  method: string;
  txId: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const initialDeposits: Deposit[] = [
  { id: "DEP001", user: "John Doe", amount: 500, method: "TRC20", txId: "TX123ABC", status: "Pending", date: "2024-01-15 14:30" },
  { id: "DEP002", user: "Jane Smith", amount: 3000, method: "BEP20", txId: "TX456DEF", status: "Approved", date: "2024-01-15 12:15" },
  { id: "DEP003", user: "Mike Johnson", amount: 1200, method: "JazzCash", txId: "TX789GHI", status: "Approved", date: "2024-01-14 18:45" },
  { id: "DEP004", user: "Sarah Wilson", amount: 800, method: "EasyPaisa", txId: "TX101JKL", status: "Rejected", date: "2024-01-14 10:20" },
  { id: "DEP005", user: "Alex Brown", amount: 5000, method: "Bank Transfer", txId: "TX202MNO", status: "Pending", date: "2024-01-13 09:30" },
  { id: "DEP006", user: "Emily Davis", amount: 2500, method: "TRC20", txId: "TX303PQR", status: "Pending", date: "2024-01-13 16:00" },
];

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);

  const loadDeposits = async () => {
    try {
      const res = await api.pendingDeposits();
      const mapped = (res.data.deposits || []).map((d: any) => ({
        id: d._id,
        user: d.user?.name || "Unknown",
        email: d.user?.email || "-",
        amount: Number(d.amountUSD || 0),
        method: d.paymentMethodId?.name || "-",
        txId: d.transactionId,
        screenshot: d.screenshot,
        status: d.status === "PENDING" ? "Pending" : d.status === "APPROVED" ? "Approved" : "Rejected",
        date: new Date(d.createdAt).toLocaleString(),
      }));
      setDeposits(mapped);
    } catch {}
  };

  useEffect(() => { loadDeposits(); }, []);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const handleApprove = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: "Approved" as const } : d));
    setSelectedDeposit(null);
    toast({ title: "Approved", description: `Deposit ${id} approved successfully` });
  };

  const handleReject = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: "Rejected" as const } : d));
    setRejectDialog(null);
    setRejectNote("");
    setSelectedDeposit(null);
    toast({ title: "Rejected", description: `Deposit ${id} has been rejected` });
  };

  const counts = {
    pending: deposits.filter(d => d.status === "Pending").length,
    approved: deposits.filter(d => d.status === "Approved").length,
    rejected: deposits.filter(d => d.status === "Rejected").length,
    pendingAmount: deposits.filter(d => d.status === "Pending").reduce((s, d) => s + d.amount, 0),
    approvedAmount: deposits.filter(d => d.status === "Approved").reduce((s, d) => s + d.amount, 0),
    rejectedAmount: deposits.filter(d => d.status === "Rejected").reduce((s, d) => s + d.amount, 0),
  };

  const renderTable = (data: Deposit[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-b border-border bg-secondary/30">
            <th className="text-left py-3 px-3 md:px-4 font-medium">ID</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">User</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">Amount</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium hidden md:table-cell">Method</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium hidden lg:table-cell">Tx ID</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">Status</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(dep => (
            <tr key={dep.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
              <td className="py-3 px-3 md:px-4 font-mono text-xs text-muted-foreground">{dep.id}</td>
              <td className="py-3 px-3 md:px-4 text-foreground">{dep.user}</td>
              <td className="py-3 px-3 md:px-4 text-foreground font-medium">${dep.amount.toLocaleString()}</td>
              <td className="py-3 px-3 md:px-4 text-muted-foreground hidden md:table-cell">{dep.method}</td>
              <td className="py-3 px-3 md:px-4 font-mono text-xs text-muted-foreground hidden lg:table-cell">{dep.txId}</td>
              <td className="py-3 px-3 md:px-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  dep.status === "Approved" ? "bg-success/10 text-success" :
                  dep.status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                }`}>{dep.status}</span>
              </td>
              <td className="py-3 px-3 md:px-4">
                <div className="flex gap-1">
                  <button onClick={() => setSelectedDeposit(dep)} className="p-1.5 hover:bg-secondary rounded"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                  {dep.status === "Pending" && (
                    <>
                      <button onClick={() => handleApprove(dep.id)} className="p-1.5 hover:bg-success/20 rounded"><CheckCircle className="w-4 h-4 text-success" /></button>
                      <button onClick={() => setRejectDialog(dep.id)} className="p-1.5 hover:bg-destructive/20 rounded"><XCircle className="w-4 h-4 text-destructive" /></button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-sm">No deposits found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

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
