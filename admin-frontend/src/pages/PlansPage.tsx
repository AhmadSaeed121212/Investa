import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Plan {
  id: string | number;
  name: string;
  min: number;
  max: number;
  dailyProfit: number;
  duration: number;
  capitalReturn: boolean;
  active: boolean;
}

const initialPlans: Plan[] = [ // fallback before API load
  { id: 1, name: "Starter Plan", min: 100, max: 999, dailyProfit: 2.5, duration: 30, capitalReturn: true, active: true },
  { id: 2, name: "Silver Plan", min: 1000, max: 4999, dailyProfit: 3.0, duration: 60, capitalReturn: true, active: true },
  { id: 3, name: "Gold Plan", min: 5000, max: 19999, dailyProfit: 3.5, duration: 90, capitalReturn: true, active: true },
  { id: 4, name: "Platinum Plan", min: 20000, max: 99999, dailyProfit: 4.0, duration: 120, capitalReturn: false, active: false },
  { id: 5, name: "Diamond Plan", min: 100000, max: 500000, dailyProfit: 5.0, duration: 180, capitalReturn: true, active: true },
];

const emptyPlan: Omit<Plan, "id"> = { name: "", min: 0, max: 0, dailyProfit: 0, duration: 0, capitalReturn: true, active: true };

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const loadPlans = async () => {
    try {
      const res = await api.plans();
      const mapped = (res.data.plans || []).map((p: any) => ({ id: p._id, name: p.name, min: p.min, max: p.max, dailyProfit: p.dailyProfit, duration: p.duration, capitalReturn: p.capitalReturn, active: p.active }));
      setPlans(mapped);
    } catch {}
  };

  useEffect(() => { loadPlans(); }, []);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, "id">>(emptyPlan);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);

  const load = () => api.plans().then((r) => setPlans(r.data.plans || []));
  useEffect(() => { load().catch(console.error); }, []);

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({ name: plan.name, min: plan.min, max: plan.max, dailyProfit: plan.dailyProfit, duration: plan.duration, capitalReturn: plan.capitalReturn, active: plan.active });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Plan name is required", variant: "destructive" });
      return;
    }
    try {
      if (editingPlan) {
        await api.updatePlan(String(editingPlan.id), form);
        toast({ title: "Success", description: `"${form.name}" updated successfully` });
      } else {
        await api.createPlan(form);
        toast({ title: "Success", description: `"${form.name}" created successfully` });
      }
      await loadPlans();
      setShowDialog(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string | number) => {
    const plan = plans.find(p => p.id === id);
    await api.deletePlan(String(id));
    await loadPlans();
    setDeleteConfirm(null);
    toast({ title: "Deleted", description: `"${plan?.name}" has been deleted` });
  };

  const togglePlan = async (id: string | number) => {
    const plan = plans.find(p => p.id === id);
    await api.togglePlan(String(id));
    await loadPlans();
    toast({ title: plan?.active ? "Deactivated" : "Activated", description: `"${plan?.name}" is now ${plan?.active ? "inactive" : "active"}` });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Plans</h1>
      <div className="grid grid-cols-2 gap-2 max-w-2xl">
        <Input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <Input placeholder="Min" type="number" value={form.min} onChange={(e)=>setForm({...form,min:Number(e.target.value)})} />
        <Input placeholder="Max" type="number" value={form.max} onChange={(e)=>setForm({...form,max:Number(e.target.value)})} />
        <Input placeholder="Daily Profit" type="number" value={form.dailyProfit} onChange={(e)=>setForm({...form,dailyProfit:Number(e.target.value)})} />
        <Input placeholder="Duration" type="number" value={form.duration} onChange={(e)=>setForm({...form,duration:Number(e.target.value)})} />
        <Button onClick={create}>Create Plan</Button>
      </div>
      <div className="space-y-2">
        {plans.map((p) => (
          <div key={p._id} className="glass-card p-3 flex justify-between items-center">
            <div>{p.name} (${p.min}-${p.max}) {p.dailyProfit}%/{p.duration}d - {p.active ? 'Active' : 'Inactive'}</div>
            <div className="space-x-2">
              <Button variant="outline" onClick={async()=>{await api.togglePlan(p._id); await load();}}>Toggle</Button>
              <Button variant="destructive" onClick={async()=>{await api.deletePlan(p._id); await load();}}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
