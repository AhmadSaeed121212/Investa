import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Users, TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle,
  DollarSign, GitBranch, CheckCircle, XCircle, Clock
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { api } from "@/lib/api";

const investmentData = [
  { name: "Mon", amount: 12400 }, { name: "Tue", amount: 18200 },
  { name: "Wed", amount: 15800 }, { name: "Thu", amount: 22100 },
  { name: "Fri", amount: 19500 }, { name: "Sat", amount: 28300 },
  { name: "Sun", amount: 24800 },
];

const depositWithdrawData = [
  { name: "Jan", deposits: 45000, withdrawals: 22000 },
  { name: "Feb", deposits: 52000, withdrawals: 28000 },
  { name: "Mar", deposits: 48000, withdrawals: 31000 },
  { name: "Apr", deposits: 61000, withdrawals: 35000 },
  { name: "May", deposits: 55000, withdrawals: 29000 },
  { name: "Jun", deposits: 67000, withdrawals: 38000 },
];

const userGrowthData = [
  { name: "Jan", users: 120 }, { name: "Feb", users: 210 },
  { name: "Mar", users: 350 }, { name: "Apr", users: 480 },
  { name: "May", users: 620 }, { name: "Jun", users: 890 },
];

const fallbackTransactions = [
  { id: "TXN001", user: "John Doe", type: "Deposit", amount: "$500", status: "Approved", time: "2 min ago" },
  { id: "TXN002", user: "Jane Smith", type: "Withdrawal", amount: "$1,200", status: "Pending", time: "5 min ago" },
  { id: "TXN003", user: "Mike Johnson", type: "Deposit", amount: "$3,000", status: "Approved", time: "12 min ago" },
  { id: "TXN004", user: "Sarah Wilson", type: "Withdrawal", amount: "$800", status: "Rejected", time: "18 min ago" },
  { id: "TXN005", user: "Alex Brown", type: "Deposit", amount: "$1,500", status: "Pending", time: "25 min ago" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="font-medium">
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [recentTransactions, setRecentTransactions] = useState<any[]>(fallbackTransactions);

  useEffect(() => {
    api.dashboard().then((r) => {
      setStats(r.data.stats || {});
      const tx = (r.data.recentTransactions || []).map((t: any) => ({
        id: String(t._id).slice(-6),
        user: t.user?.name || "User",
        type: t.direction === "CREDIT" ? "Deposit" : "Withdrawal",
        amount: `$${Number(t.amount || 0).toFixed(2)}`,
        status: "Approved",
        time: new Date(t.createdAt).toLocaleString(),
      }));
      if (tx.length) setRecentTransactions(tx);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={String(stats.totalUsers ?? "12,458")} change="+12% this month" changeType="positive" icon={Users} delay={0} />
        <StatCard title="Active Users" value="8,234" change="+8% this week" changeType="positive" icon={TrendingUp} delay={0.05} />
        <StatCard title="Total Investments" value="$2.4M" change="+23% this month" changeType="positive" icon={DollarSign} delay={0.1} />
        <StatCard title="Pending Deposits" value={`$${Number(stats.approvedDepositsAmount ?? 18420).toLocaleString()}`} change={`${stats.pendingDeposits ?? 24} pending`} changeType="neutral" icon={Clock} delay={0.15} />
        <StatCard title="Total Profit Paid" value="$342K" change="+15% this month" changeType="positive" icon={Wallet} delay={0.2} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Approved Deposits" value="$1.8M" icon={CheckCircle} delay={0.25} />
        <StatCard title="Pending Withdrawals" value={`$${Number(stats.paidWithdrawalsAmount ?? 9840).toLocaleString()}`} change={`${stats.pendingWithdrawals ?? 12} pending`} icon={ArrowUpCircle} delay={0.3} />
        <StatCard title="Approved Withdrawals" value="$890K" icon={ArrowDownCircle} delay={0.35} />
        <StatCard title="Referral Commissions" value="$45,200" change="+18% this month" changeType="positive" icon={GitBranch} delay={0.4} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Active Investments (Weekly)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={investmentData}>
              <defs>
                <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="amount" stroke="hsl(174, 72%, 50%)" fill="url(#investGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Deposits vs Withdrawals</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={depositWithdrawData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="deposits" fill="hsl(174, 72%, 50%)" radius={[4, 4, 0, 0]} name="Deposits" />
              <Bar dataKey="withdrawals" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} name="Withdrawals" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* User Growth + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="users" stroke="hsl(152, 60%, 45%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 45%)", r: 4 }} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">ID</th>
                  <th className="text-left py-2 font-medium">User</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Amount</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="py-2.5 text-foreground">{tx.user}</td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium ${tx.type === "Deposit" ? "text-success" : "text-info"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-foreground font-medium">{tx.amount}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tx.status === "Approved" ? "bg-success/10 text-success" :
                        tx.status === "Pending" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground text-xs">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
