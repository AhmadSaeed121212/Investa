import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">Withdrawal Management</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Process withdrawal requests</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary border border-border w-full sm:w-auto flex">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">All</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 sm:flex-initial">Pending</TabsTrigger>
          <TabsTrigger value="approved" className="flex-1 sm:flex-initial">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1 sm:flex-initial">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><div className="glass-card overflow-hidden">{renderTable(withdrawals)}</div></TabsContent>
        <TabsContent value="pending"><div className="glass-card overflow-hidden">{renderTable(withdrawals.filter(w => w.status === "Pending"))}</div></TabsContent>
        <TabsContent value="approved"><div className="glass-card overflow-hidden">{renderTable(withdrawals.filter(w => w.status === "Approved"))}</div></TabsContent>
        <TabsContent value="rejected"><div className="glass-card overflow-hidden">{renderTable(withdrawals.filter(w => w.status === "Rejected"))}</div></TabsContent>
      </Tabs>

      {/* Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle className="text-foreground">Withdrawal Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              {[
                { label: "ID", value: selected.id },
                { label: "User", value: selected.user },
                { label: "Amount", value: `$${selected.amount.toLocaleString()}` },
                { label: "Method", value: selected.method },
                { label: "Wallet", value: selected.wallet },
                { label: "Date", value: selected.date },
                { label: "Status", value: selected.status },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              {selected.status === "Pending" && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button className="flex-1 gap-2" onClick={() => handleApprove(selected.id)}><CheckCircle className="w-4 h-4" /> Approve</Button>
                  <Button variant="destructive" className="flex-1 gap-2" onClick={() => { setSelected(null); setRejectDialog(selected.id); }}><XCircle className="w-4 h-4" /> Reject</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject */}
      <Dialog open={rejectDialog !== null} onOpenChange={() => { setRejectDialog(null); setRejectNote(""); }}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-sm">
          <DialogHeader><DialogTitle className="text-foreground">Reject Withdrawal</DialogTitle></DialogHeader>
          <div><Label>Note (optional)</Label><Textarea placeholder="Reason..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} className="mt-1" /></div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectNote(""); }} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={() => rejectDialog && handleReject(rejectDialog)} className="w-full sm:w-auto">Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
