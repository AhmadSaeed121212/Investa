import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Plan {
  id: number;
  name: string;
  min: number;
  max: number;
  dailyProfit: number;
  duration: number;
  capitalReturn: boolean;
  active: boolean;
}

const initialPlans: Plan[] = [
  { id: 1, name: "Starter Plan", min: 100, max: 999, dailyProfit: 2.5, duration: 30, capitalReturn: true, active: true },
  { id: 2, name: "Silver Plan", min: 1000, max: 4999, dailyProfit: 3.0, duration: 60, capitalReturn: true, active: true },
  { id: 3, name: "Gold Plan", min: 5000, max: 19999, dailyProfit: 3.5, duration: 90, capitalReturn: true, active: true },
  { id: 4, name: "Platinum Plan", min: 20000, max: 99999, dailyProfit: 4.0, duration: 120, capitalReturn: false, active: false },
  { id: 5, name: "Diamond Plan", min: 100000, max: 500000, dailyProfit: 5.0, duration: 180, capitalReturn: true, active: true },
];

const emptyPlan: Omit<Plan, "id"> = { name: "", min: 0, max: 0, dailyProfit: 0, duration: 0, capitalReturn: true, active: true };

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, "id">>(emptyPlan);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyPlan);
    setShowDialog(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({ name: plan.name, min: plan.min, max: plan.max, dailyProfit: plan.dailyProfit, duration: plan.duration, capitalReturn: plan.capitalReturn, active: plan.active });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Plan name is required", variant: "destructive" });
      return;
    }
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...form } : p));
      toast({ title: "Success", description: `"${form.name}" updated successfully` });
    } else {
      const newId = Math.max(...plans.map(p => p.id), 0) + 1;
      setPlans(prev => [...prev, { id: newId, ...form }]);
      toast({ title: "Success", description: `"${form.name}" created successfully` });
    }
    setShowDialog(false);
  };

  const handleDelete = (id: number) => {
    const plan = plans.find(p => p.id === id);
    setPlans(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Deleted", description: `"${plan?.name}" has been deleted` });
  };

  const togglePlan = (id: number) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const plan = plans.find(p => p.id === id);
    toast({ title: plan?.active ? "Deactivated" : "Activated", description: `"${plan?.name}" is now ${plan?.active ? "inactive" : "active"}` });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Investment Plans</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Create and manage investment plans</p>
        </div>
        <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 md:p-5 relative overflow-hidden ${!plan.active ? "opacity-60" : ""}`}
          >
            {plan.active && <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />}
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <h3 className="text-foreground font-semibold text-base md:text-lg">{plan.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {plan.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => openEdit(plan)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => togglePlan(plan.id)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  {plan.active ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                </button>
                <button onClick={() => setDeleteConfirm(plan.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Investment Range</span><span className="text-foreground font-medium">${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Daily Profit</span><span className="text-primary font-bold">{plan.dailyProfit}%</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-medium">{plan.duration} Days</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Capital Return</span><span className={`font-medium ${plan.capitalReturn ? "text-success" : "text-destructive"}`}>{plan.capitalReturn ? "Yes" : "No"}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingPlan ? "Edit Plan" : "Create Investment Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Plan Name</Label><Input placeholder="e.g. Gold Plan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Min Investment ($)</Label><Input type="number" value={form.min || ""} onChange={e => setForm({ ...form, min: Number(e.target.value) })} className="mt-1" /></div>
              <div><Label>Max Investment ($)</Label><Input type="number" value={form.max || ""} onChange={e => setForm({ ...form, max: Number(e.target.value) })} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Daily Profit (%)</Label><Input type="number" step="0.1" value={form.dailyProfit || ""} onChange={e => setForm({ ...form, dailyProfit: Number(e.target.value) })} className="mt-1" /></div>
              <div><Label>Duration (Days)</Label><Input type="number" value={form.duration || ""} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="mt-1" /></div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Capital Return</Label>
              <Switch checked={form.capitalReturn} onCheckedChange={v => setForm({ ...form, capitalReturn: v })} />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">{editingPlan ? "Update Plan" : "Create Plan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{plans.find(p => p.id === deleteConfirm)?.name}"? This action cannot be undone.</p>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="w-full sm:w-auto">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
