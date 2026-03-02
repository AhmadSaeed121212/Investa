import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, Eye, Ban, Trash2, Edit, UserCheck, UserX, Plus, DollarSign, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  deposit: number;
  withdraw: number;
  status: "Active" | "Suspended" | "Banned";
  investment: boolean;
}

const initialUsers: User[] = [
  { id: "USR001", name: "John Doe", email: "john@example.com", balance: 5200, deposit: 12000, withdraw: 6800, status: "Active", investment: true },
  { id: "USR002", name: "Jane Smith", email: "jane@example.com", balance: 3100, deposit: 8500, withdraw: 5400, status: "Active", investment: true },
  { id: "USR003", name: "Mike Johnson", email: "mike@example.com", balance: 800, deposit: 2000, withdraw: 1200, status: "Suspended", investment: false },
  { id: "USR004", name: "Sarah Wilson", email: "sarah@example.com", balance: 15400, deposit: 25000, withdraw: 9600, status: "Active", investment: true },
  { id: "USR005", name: "Alex Brown", email: "alex@example.com", balance: 0, deposit: 500, withdraw: 500, status: "Banned", investment: false },
  { id: "USR006", name: "Emily Davis", email: "emily@example.com", balance: 7800, deposit: 18000, withdraw: 10200, status: "Active", investment: true },
  { id: "USR007", name: "Chris Lee", email: "chris@example.com", balance: 2300, deposit: 5000, withdraw: 2700, status: "Active", investment: false },
  { id: "USR008", name: "Lisa Anderson", email: "lisa@example.com", balance: 11200, deposit: 22000, withdraw: 10800, status: "Active", investment: true },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const loadUsers = async () => {
    try {
      const res = await api.users();
      const mapped = (res.data.users || []).map((u: any) => ({
        id: u._id, name: u.name, email: u.email, phone: u.phone || "-", balance: Number(u.walletBalance || 0),
        totalDeposit: Number(u.totalInvested || 0), totalWithdraw: 0, totalProfit: Number(u.totalEarnings || 0),
        referredBy: "-", joinDate: new Date(u.createdAt).toISOString().slice(0,10),
        status: u.isBlocked ? "Suspended" : "Active",
      }));
      setUsers(mapped);
    } catch {}
  };

  useEffect(() => { loadUsers(); }, []);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [balanceDialog, setBalanceDialog] = useState<{ userId: string; type: "add" | "deduct" } | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setEditForm({ ...user });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editForm) return;
    setUsers(prev => prev.map(u => u.id === editForm.id ? editForm : u));
    setShowEdit(false);
    toast({ title: "Updated", description: `${editForm.name} updated successfully` });
  };

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
    setShowDetail(false);
    toast({ title: "Deleted", description: `${user?.name} has been deleted` });
  };

  const handleStatusChange = (id: string, status: User["status"]) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    toast({ title: "Status Changed", description: `User status changed to ${status}` });
  };

  const handleBalance = async () => {
    if (!balanceDialog || !balanceAmount) return;
    const amount = Number(balanceAmount);
    if (isNaN(amount) || amount <= 0) { toast({ title: "Error", description: "Enter a valid amount", variant: "destructive" }); return; }
    setUsers(prev => prev.map(u => {
      if (u.id !== balanceDialog.userId) return u;
      return { ...u, balance: balanceDialog.type === "add" ? u.balance + amount : Math.max(0, u.balance - amount) };
    }));
    toast({ title: balanceDialog.type === "add" ? "Balance Added" : "Balance Deducted", description: `$${amount} ${balanceDialog.type === "add" ? "added to" : "deducted from"} user account` });
    setBalanceDialog(null);
    setBalanceAmount("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      {users.map((u) => (
        <div key={u._id} className="glass-card p-3">
          <div className="flex justify-between"><div>{u.name} ({u.email})</div><div>Wallet: ${u.walletBalance?.toFixed(2)}</div></div>
          <div className="mt-2 space-x-2 flex items-center">
            <Button variant="outline" onClick={async()=>{await api.updateUserStatus(u._id,!u.isBlocked); await load();}}>{u.isBlocked ? 'Unblock' : 'Block'}</Button>
            <Input className="max-w-32" placeholder="Amount" value={amount[u._id]||''} onChange={(e)=>setAmount({...amount,[u._id]:e.target.value})} />
            <Button onClick={async()=>{await api.adjustWallet(u._id,Number(amount[u._id]||0),'CREDIT'); await load();}}>Add</Button>
            <Button variant="destructive" onClick={async()=>{await api.adjustWallet(u._id,Number(amount[u._id]||0),'DEBIT'); await load();}}>Deduct</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
