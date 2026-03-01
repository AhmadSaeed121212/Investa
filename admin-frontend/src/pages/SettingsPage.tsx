import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">General Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your website settings</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
        <div><Label>Website Name</Label><Input defaultValue="InvestPro" className="mt-1" /></div>
        <div>
          <Label>Website Logo</Label>
          <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">Click or drag to upload logo</p>
          </div>
        </div>
        <div>
          <Label>Currency</Label>
          <Select defaultValue="usd">
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD ($)</SelectItem>
              <SelectItem value="pkr">PKR (₨)</SelectItem>
              <SelectItem value="eur">EUR (€)</SelectItem>
              <SelectItem value="gbp">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Signup Bonus ($)</Label><Input type="number" defaultValue="5" className="mt-1" /></div>
        <div><Label>Admin Email</Label><Input defaultValue="admin@investpro.com" className="mt-1" /></div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Maintenance Mode</Label>
            <p className="text-xs text-muted-foreground">Disable website access for users</p>
          </div>
          <Switch />
        </div>
        <Button>Save Settings</Button>
      </motion.div>
    </div>
  );
}
