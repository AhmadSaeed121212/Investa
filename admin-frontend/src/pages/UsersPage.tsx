import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, Eye, Ban, Trash2, Edit, UserCheck, UserX, Plus, DollarSign, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">User Management</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full sm:w-56" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-3 md:px-4 font-medium">User</th>
                <th className="text-left py-3 px-3 md:px-4 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-3 md:px-4 font-medium">Balance</th>
                <th className="text-left py-3 px-3 md:px-4 font-medium hidden lg:table-cell">Deposit</th>
                <th className="text-left py-3 px-3 md:px-4 font-medium hidden lg:table-cell">Withdraw</th>
                <th className="text-left py-3 px-3 md:px-4 font-medium">Status</th>
                <th className="text-left py-3 px-3 md:px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3 md:px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <span className="text-foreground font-medium block truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground sm:hidden block truncate">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                  <td className="py-3 px-3 md:px-4 text-foreground font-medium">${user.balance.toLocaleString()}</td>
                  <td className="py-3 px-3 md:px-4 text-success hidden lg:table-cell">${user.deposit.toLocaleString()}</td>
                  <td className="py-3 px-3 md:px-4 text-info hidden lg:table-cell">${user.withdraw.toLocaleString()}</td>
                  <td className="py-3 px-3 md:px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.status === "Active" ? "bg-success/10 text-success" :
                      user.status === "Suspended" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    }`}>{user.status}</span>
                  </td>
                  <td className="py-3 px-3 md:px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-secondary rounded transition-colors"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowDetail(true); }} className="gap-2"><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user)} className="gap-2"><Edit className="w-4 h-4" /> Edit User</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBalanceDialog({ userId: user.id, type: "add" })} className="gap-2"><DollarSign className="w-4 h-4" /> Add Balance</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBalanceDialog({ userId: user.id, type: "deduct" })} className="gap-2"><MinusCircle className="w-4 h-4" /> Deduct Balance</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><UserCheck className="w-4 h-4" /> Login as User</DropdownMenuItem>
                        {user.status !== "Suspended" && <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Suspended")} className="gap-2 text-warning"><UserX className="w-4 h-4" /> Suspend</DropdownMenuItem>}
                        {user.status !== "Banned" && <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Banned")} className="gap-2 text-destructive"><Ban className="w-4 h-4" /> Ban User</DropdownMenuItem>}
                        {user.status !== "Active" && <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Active")} className="gap-2 text-success"><UserCheck className="w-4 h-4" /> Activate</DropdownMenuItem>}
                        <DropdownMenuItem onClick={() => setDeleteConfirm(user.id)} className="gap-2 text-destructive"><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No users found</p>}
        </div>
      </motion.div>

      {/* View Detail */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-foreground">User Details</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {selectedUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-foreground font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Wallet Balance", value: `$${selectedUser.balance.toLocaleString()}` },
                  { label: "Total Deposited", value: `$${selectedUser.deposit.toLocaleString()}` },
                  { label: "Total Withdrawn", value: `$${selectedUser.withdraw.toLocaleString()}` },
                  { label: "Active Investment", value: selectedUser.investment ? "Yes" : "No" },
                  { label: "Account Status", value: selectedUser.status },
                  { label: "User ID", value: selectedUser.id },
                ].map(item => (
                  <div key={item.label} className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setShowDetail(false); setBalanceDialog({ userId: selectedUser.id, type: "add" }); }}>Add Balance</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setShowDetail(false); setBalanceDialog({ userId: selectedUser.id, type: "deduct" }); }}>Deduct Balance</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle className="text-foreground">Edit User</DialogTitle></DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div><Label>Full Name</Label><Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" /></div>
              <div><Label>Email</Label><Input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="mt-1" /></div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEdit(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={saveEdit} className="w-full sm:w-auto">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Balance Dialog */}
      <Dialog open={balanceDialog !== null} onOpenChange={() => { setBalanceDialog(null); setBalanceAmount(""); }}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-sm">
          <DialogHeader><DialogTitle className="text-foreground">{balanceDialog?.type === "add" ? "Add Balance" : "Deduct Balance"}</DialogTitle></DialogHeader>
          <div><Label>Amount ($)</Label><Input type="number" placeholder="Enter amount" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)} className="mt-1" /></div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setBalanceDialog(null); setBalanceAmount(""); }} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleBalance} className="w-full sm:w-auto">{balanceDialog?.type === "add" ? "Add" : "Deduct"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-sm">
          <DialogHeader><DialogTitle className="text-foreground">Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this user? This cannot be undone.</p>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="w-full sm:w-auto">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
