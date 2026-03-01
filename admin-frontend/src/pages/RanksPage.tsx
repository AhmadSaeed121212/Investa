import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Rank {
  id: number;
  name: string;
  requiredInvestment: number;
  monthlySalary: number;
  bonus: number;
  active: boolean;
}

const initialRanks: Rank[] = [
  { id: 1, name: "Rank 1 – Bronze", requiredInvestment: 1000, monthlySalary: 50, bonus: 0, active: true },
  { id: 2, name: "Rank 2 – Silver", requiredInvestment: 5000, monthlySalary: 200, bonus: 50, active: true },
  { id: 3, name: "Rank 3 – Gold", requiredInvestment: 15000, monthlySalary: 600, bonus: 150, active: true },
  { id: 4, name: "Rank 4 – Platinum", requiredInvestment: 50000, monthlySalary: 2000, bonus: 500, active: true },
  { id: 5, name: "Rank 5 – Diamond", requiredInvestment: 100000, monthlySalary: 5000, bonus: 1500, active: false },
];

const emptyRank: Omit<Rank, "id"> = { name: "", requiredInvestment: 0, monthlySalary: 0, bonus: 0, active: true };

export default function RanksPage() {
  const [ranks, setRanks] = useState<Rank[]>(initialRanks);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);
  const [form, setForm] = useState<Omit<Rank, "id">>(emptyRank);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openCreate = () => {
    setEditingRank(null);
    setForm(emptyRank);
    setShowDialog(true);
  };

  const openEdit = (rank: Rank) => {
    setEditingRank(rank);
    setForm({ name: rank.name, requiredInvestment: rank.requiredInvestment, monthlySalary: rank.monthlySalary, bonus: rank.bonus, active: rank.active });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Rank name is required", variant: "destructive" });
      return;
    }
    if (editingRank) {
      setRanks(prev => prev.map(r => r.id === editingRank.id ? { ...r, ...form } : r));
      toast({ title: "Updated", description: `"${form.name}" updated successfully` });
    } else {
      const newId = Math.max(...ranks.map(r => r.id), 0) + 1;
      setRanks(prev => [...prev, { id: newId, ...form }]);
      toast({ title: "Created", description: `"${form.name}" created successfully` });
    }
    setShowDialog(false);
  };

  const handleDelete = (id: number) => {
    const rank = ranks.find(r => r.id === id);
    setRanks(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Deleted", description: `"${rank?.name}" has been deleted` });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Ranks & Salary System</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Manage rank-based monthly salary rewards</p>
        </div>
        <Button onClick={openCreate} className="gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" /> Add Rank</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {ranks.map((rank, i) => (
          <motion.div key={rank.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 md:p-5 ${!rank.active ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <h3 className="text-foreground font-semibold text-base md:text-lg">{rank.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rank.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {rank.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => openEdit(rank)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={() => setDeleteConfirm(rank.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Required Investment</span><span className="text-foreground font-medium">${rank.requiredInvestment.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Monthly Salary</span><span className="text-primary font-bold">${rank.monthlySalary.toLocaleString()}</span></div>
              {rank.bonus > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Bonus Reward</span><span className="text-success font-medium">${rank.bonus.toLocaleString()}</span></div>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle className="text-foreground">{editingRank ? "Edit Rank" : "Add New Rank"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Rank Name</Label><Input placeholder="e.g. Gold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
            <div><Label>Required Total Investment ($)</Label><Input type="number" value={form.requiredInvestment || ""} onChange={e => setForm({ ...form, requiredInvestment: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Monthly Salary ($)</Label><Input type="number" value={form.monthlySalary || ""} onChange={e => setForm({ ...form, monthlySalary: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Bonus Reward ($)</Label><Input type="number" value={form.bonus || ""} onChange={e => setForm({ ...form, bonus: Number(e.target.value) })} className="mt-1" /></div>
            <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /></div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">{editingRank ? "Update Rank" : "Create Rank"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-sm">
          <DialogHeader><DialogTitle className="text-foreground">Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{ranks.find(r => r.id === deleteConfirm)?.name}"?</p>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="w-full sm:w-auto">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
