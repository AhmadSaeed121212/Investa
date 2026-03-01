import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">Deposit Management</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Review and manage all deposits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Pending", count: counts.pending, amount: `$${counts.pendingAmount.toLocaleString()}`, color: "text-warning" },
          { label: "Approved", count: counts.approved, amount: `$${counts.approvedAmount.toLocaleString()}`, color: "text-success" },
          { label: "Rejected", count: counts.rejected, amount: `$${counts.rejectedAmount.toLocaleString()}`, color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="glass-card p-3 md:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-xl md:text-2xl font-bold ${s.color}`}>{s.count}</p>
            </div>
            <p className="text-base md:text-lg font-semibold text-foreground">{s.amount}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary border border-border w-full sm:w-auto flex">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">All</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 sm:flex-initial">Pending</TabsTrigger>
          <TabsTrigger value="approved" className="flex-1 sm:flex-initial">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1 sm:flex-initial">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><div className="glass-card overflow-hidden">{renderTable(deposits)}</div></TabsContent>
        <TabsContent value="pending"><div className="glass-card overflow-hidden">{renderTable(deposits.filter(d => d.status === "Pending"))}</div></TabsContent>
        <TabsContent value="approved"><div className="glass-card overflow-hidden">{renderTable(deposits.filter(d => d.status === "Approved"))}</div></TabsContent>
        <TabsContent value="rejected"><div className="glass-card overflow-hidden">{renderTable(deposits.filter(d => d.status === "Rejected"))}</div></TabsContent>
      </Tabs>

      {/* Detail */}
      <Dialog open={!!selectedDeposit} onOpenChange={() => setSelectedDeposit(null)}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle className="text-foreground">Deposit Details</DialogTitle></DialogHeader>
          {selectedDeposit && (
            <div className="space-y-3">
              {[
                { label: "Deposit ID", value: selectedDeposit.id },
                { label: "User", value: selectedDeposit.user },
                { label: "Amount", value: `$${selectedDeposit.amount.toLocaleString()}` },
                { label: "Method", value: selectedDeposit.method },
                { label: "Transaction ID", value: selectedDeposit.txId },
                { label: "Date", value: selectedDeposit.date },
                { label: "Status", value: selectedDeposit.status },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              {selectedDeposit.status === "Pending" && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button className="flex-1 gap-2" onClick={() => handleApprove(selectedDeposit.id)}><CheckCircle className="w-4 h-4" /> Approve</Button>
                  <Button variant="destructive" className="flex-1 gap-2" onClick={() => { setSelectedDeposit(null); setRejectDialog(selectedDeposit.id); }}><XCircle className="w-4 h-4" /> Reject</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject with note */}
      <Dialog open={rejectDialog !== null} onOpenChange={() => { setRejectDialog(null); setRejectNote(""); }}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-sm">
          <DialogHeader><DialogTitle className="text-foreground">Reject Deposit</DialogTitle></DialogHeader>
          <div><Label>Rejection Note (optional)</Label><Textarea placeholder="Reason for rejection..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} className="mt-1" /></div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectNote(""); }} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={() => rejectDialog && handleReject(rejectDialog)} className="w-full sm:w-auto">Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
