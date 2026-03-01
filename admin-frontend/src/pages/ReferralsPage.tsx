import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LevelCommission {
  level: number;
  depositCommission: number;
  investmentCommission: number;
  dailyEarning: number;
}

const initialLevels: LevelCommission[] = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  depositCommission: [5, 3, 2, 1.5, 1, 0.8, 0.6, 0.4, 0.3, 0.2][i],
  investmentCommission: [8, 5, 3, 2, 1.5, 1, 0.8, 0.5, 0.3, 0.2][i],
  dailyEarning: [3, 2, 1.5, 1, 0.8, 0.5, 0.3, 0.2, 0.1, 0.05][i],
}));

export default function ReferralsPage() {
  const [levels, setLevels] = useState<LevelCommission[]>(initialLevels);

  const updateLevel = (index: number, field: keyof LevelCommission, value: number) => {
    setLevels(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  const handleSave = () => {
    toast({ title: "Saved", description: "Referral commission settings saved successfully" });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">Referral & Commission System</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Configure multi-level referral commissions (up to 10 levels)</p>
      </div>

      {/* Mobile: Card Layout */}
      <div className="block md:hidden space-y-3">
        {levels.map((lvl, i) => (
          <motion.div key={lvl.level} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 space-y-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">Level {lvl.level}</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Deposit %</Label>
                <Input type="number" step="0.1" value={lvl.depositCommission} onChange={e => updateLevel(i, "depositCommission", Number(e.target.value))} className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Investment %</Label>
                <Input type="number" step="0.1" value={lvl.investmentCommission} onChange={e => updateLevel(i, "investmentCommission", Number(e.target.value))} className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Daily %</Label>
                <Input type="number" step="0.01" value={lvl.dailyEarning} onChange={e => updateLevel(i, "dailyEarning", Number(e.target.value))} className="h-8 text-sm mt-1" />
              </div>
            </div>
          </motion.div>
        ))}
        <Button onClick={handleSave} className="w-full">Save Commission Settings</Button>
      </div>

      {/* Desktop: Table Layout */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium">Level</th>
                <th className="text-left py-3 px-4 font-medium">Deposit Commission (%)</th>
                <th className="text-left py-3 px-4 font-medium">Investment Commission (%)</th>
                <th className="text-left py-3 px-4 font-medium">Daily Earning Commission (%)</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((lvl, i) => (
                <tr key={lvl.level} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">Level {lvl.level}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Input type="number" step="0.1" value={lvl.depositCommission} onChange={e => updateLevel(i, "depositCommission", Number(e.target.value))} className="w-24 h-8 text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <Input type="number" step="0.1" value={lvl.investmentCommission} onChange={e => updateLevel(i, "investmentCommission", Number(e.target.value))} className="w-24 h-8 text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <Input type="number" step="0.01" value={lvl.dailyEarning} onChange={e => updateLevel(i, "dailyEarning", Number(e.target.value))} className="w-24 h-8 text-sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <Button onClick={handleSave}>Save Commission Settings</Button>
        </div>
      </motion.div>
    </div>
  );
}
