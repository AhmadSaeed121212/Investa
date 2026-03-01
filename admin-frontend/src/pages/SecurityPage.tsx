import { motion } from "framer-motion";
import { Shield, Key, Activity, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const activityLogs = [
  { action: "Approved deposit DEP001", admin: "Super Admin", time: "2 min ago" },
  { action: "Banned user USR005", admin: "Super Admin", time: "15 min ago" },
  { action: "Created plan Diamond Plan", admin: "Super Admin", time: "1 hour ago" },
  { action: "Updated referral settings", admin: "Super Admin", time: "3 hours ago" },
  { action: "Rejected withdrawal WTH004", admin: "Super Admin", time: "5 hours ago" },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Security & Access</h2>
        <p className="text-sm text-muted-foreground">Manage admin security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
          <h3 className="text-foreground font-semibold flex items-center gap-2"><Key className="w-4 h-4 text-primary" /> Change Admin Password</h3>
          <div><Label>Current Password</Label><Input type="password" className="mt-1" /></div>
          <div><Label>New Password</Label><Input type="password" className="mt-1" /></div>
          <div><Label>Confirm Password</Label><Input type="password" className="mt-1" /></div>
          <Button>Update Password</Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-5">
          <h3 className="text-foreground font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Security Options</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-xs text-muted-foreground">Add extra security layer</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Login Notifications</Label>
              <p className="text-xs text-muted-foreground">Email alerts on admin login</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>IP Whitelisting</Label>
              <p className="text-xs text-muted-foreground">Restrict admin access by IP</p>
            </div>
            <Switch />
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="text-foreground font-semibold flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-primary" /> Recent Activity Logs</h3>
        <div className="space-y-3">
          {activityLogs.map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm text-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground">by {log.admin}</p>
              </div>
              <span className="text-xs text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
