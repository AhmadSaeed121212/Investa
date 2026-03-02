import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", min: 0, max: 0, dailyProfit: 0, duration: 0, capitalReturn: true, active: true });

  const load = () => api.plans().then((r) => setPlans(r.data.plans || []));
  useEffect(() => { load().catch(console.error); }, []);

  const create = async () => { await api.createPlan(form); setForm({ ...form, name: "" }); await load(); };

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
