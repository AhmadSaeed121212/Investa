import { useState } from "react";
import { motion } from "framer-motion";

import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Gateway {
  id: number;
  name: string;
  minDeposit: number;
  maxDeposit: number;
  fee: string;
  wallet: string;
  qrCode?: string;
  requireScreenshot: boolean;
  requireTxId: boolean;
  instructions: string;
  active: boolean;
}

const initialGateways: Gateway[] = [
  {
    id: 1,
    name: "TRC20 (USDT)",
    minDeposit: 10,
    maxDeposit: 50000,
    fee: "0%",
    wallet: "TXabc...xyz",
    qrCode: "/qrcodes/trc20.png",
    requireScreenshot: true,
    requireTxId: true,
    instructions: "Send USDT to the address above.\nApproval usually within 5–30 minutes.\nDo not send other tokens.",
    active: true,
  },
  {
    id: 3,
    name: "JazzCash",
    minDeposit: 500,
    maxDeposit: 25000,
    fee: "2%",
    wallet: "0300-1234567",
    qrCode: undefined,
    requireScreenshot: true,
    requireTxId: false,
    instructions: "Send money to JazzCash number above.\nUpload transaction screenshot.\nApproval time: 10–60 minutes.",
    active: true,
  },
];

const emptyGateway: Omit<Gateway, "id"> = {
  name: "",
  minDeposit: 0,
  maxDeposit: 0,
  fee: "",
  wallet: "",
  qrCode: undefined,
  requireScreenshot: true,
  requireTxId: true,
  instructions: "",
  active: true,
};

export default function GatewaysPage() {
  const [gateways, setGateways] = useState<Gateway[]>(initialGateways);
  const [showDialog, setShowDialog] = useState(false);
  const [editingGw, setEditingGw] = useState<Gateway | null>(null);
  const [form, setForm] = useState<Omit<Gateway, "id">>(emptyGateway);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openCreate = () => {
    setEditingGw(null);
    setForm(emptyGateway);
    setShowDialog(true);
  };

  const openEdit = (gw: Gateway) => {
    setEditingGw(gw);
    setForm({
      name: gw.name,
      minDeposit: gw.minDeposit,
      maxDeposit: gw.maxDeposit,
      fee: gw.fee,
      wallet: gw.wallet,
      qrCode: gw.qrCode,
      requireScreenshot: gw.requireScreenshot,
      requireTxId: gw.requireTxId,
      instructions: gw.instructions,
      active: gw.active,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Gateway name is required", variant: "destructive" });
      return;
    }

    if (form.minDeposit > 0 && form.maxDeposit > 0 && form.minDeposit >= form.maxDeposit) {
      toast({
        title: "Invalid limits",
        description: "Maximum deposit must be greater than minimum deposit",
        variant: "destructive",
      });
      return;
    }

    setGateways((current) => {
      if (editingGw) {
        // Update existing gateway
        return current.map((g) =>
          g.id === editingGw.id ? { id: g.id, ...form } : g
        );
      }

      // Create new gateway
      const maxId = current.length > 0 ? Math.max(...current.map(g => g.id)) : 0;
      const newId = maxId + 1;
      return [...current, { id: newId, ...form }];
    });

    toast({
      title: editingGw ? "Gateway updated" : "Gateway created",
      description: `"${form.name}" has been ${editingGw ? "updated" : "added"}`,
    });

    setShowDialog(false);
  };

  const handleDelete = (id: number) => {
    const name = gateways.find(g => g.id === id)?.name || "this gateway";
    setGateways(prev => prev.filter(g => g.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Deleted", description: `"${name}" removed` });
  };

  const toggleGw = (id: number) => {
    setGateways(prev =>
      prev.map(g =>
        g.id === id ? { ...g, active: !g.active } : g
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, qrCode: previewUrl }));

    toast({
      title: "QR Code selected",
      description: file.name,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Deposit Gateways</h2>
          <p className="text-muted-foreground">Manage available deposit methods</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add New Gateway
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gateways.map((gw, i) => (
          <motion.div
            key={gw.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border bg-card p-5 shadow-sm ${!gw.active ? "opacity-60" : ""}`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{gw.name}</h3>
                <span
                  className={`mt-1.5 inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    gw.active
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {gw.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-1 -mr-2">
                <button
                  onClick={() => openEdit(gw)}
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => toggleGw(gw.id)}
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  {gw.active ? (
                    <ToggleRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(gw.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Limits</span>
                <span>${gw.minDeposit.toLocaleString()} – ${gw.maxDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span>{gw.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet</span>
                <span className="font-mono text-xs break-all">{gw.wallet}</span>
              </div>
              {gw.qrCode && (
                <div className="pt-2">
                  <span className="text-muted-foreground text-xs block mb-1">QR Code</span>
                  <img
                    src={gw.qrCode}
                    alt="QR Code"
                    className="h-20 w-20 object-contain border rounded bg-white p-1 mx-auto"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Create / Edit Modal ──────────────────────────────────────── */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="
            max-w-[95vw] sm:max-w-md lg:max-w-lg
            max-h-[90vh]
            overflow-y-auto
            p-0 gap-0
            shadow-2xl
          "
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-card border-b px-5 sm:px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
              {editingGw ? "Edit Gateway" : "New Deposit Gateway"}
            </DialogTitle>
          </div>

          {/* Scrollable Content */}
          <div className="px-5 sm:px-6 py-6 space-y-5 flex-1">
            <div>
              <Label className="text-sm">Gateway Name *</Label>
              <Input
                placeholder="e.g. TRC20 (USDT), JazzCash, Bank Transfer"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Min Deposit ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.minDeposit || ""}
                  onChange={e => setForm({ ...form, minDeposit: Number(e.target.value) || 0 })}
                  className="mt-1.5 h-9"
                />
              </div>
              <div>
                <Label className="text-sm">Max Deposit ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.maxDeposit || ""}
                  onChange={e => setForm({ ...form, maxDeposit: Number(e.target.value) || 0 })}
                  className="mt-1.5 h-9"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Deposit Fee</Label>
              <Input
                placeholder="e.g. 0%, 1.5%, 50 PKR"
                value={form.fee}
                onChange={e => setForm({ ...form, fee: e.target.value })}
                className="mt-1.5 h-9"
              />
            </div>

            <div>
              <Label className="text-sm">Wallet / Account</Label>
              <Input
                value={form.wallet}
                onChange={e => setForm({ ...form, wallet: e.target.value })}
                className="mt-1.5 h-9 font-mono text-sm"
              />
            </div>

            <div>
              <Label className="text-sm">QR Code (optional)</Label>
              <div className="mt-1.5 flex flex-wrap gap-4 items-start">
                <label className="cursor-pointer flex-1 min-w-[180px]">
                  <div className="border border-dashed rounded-md px-4 py-6 text-center hover:bg-muted/60 transition-colors">
                    <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">Click to upload QR</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {form.qrCode && (
                  <div className="relative">
                    <img
                      src={form.qrCode}
                      alt="QR preview"
                      className="h-20 w-20 object-contain rounded border bg-white p-1"
                    />
                    <button
                      onClick={() => setForm(p => ({ ...p, qrCode: undefined }))}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm">Instructions / Rules</Label>
              <Textarea
                placeholder="Approval time, network rules, warnings..."
                value={form.instructions}
                onChange={e => setForm({ ...form, instructions: e.target.value })}
                className="mt-1.5 min-h-[100px] text-sm resize-y"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Require Screenshot Upload</Label>
                <Switch
                  checked={form.requireScreenshot}
                  onCheckedChange={v => setForm({ ...form, requireScreenshot: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Require Transaction ID / Ref</Label>
                <Switch
                  checked={form.requireTxId}
                  onCheckedChange={v => setForm({ ...form, requireTxId: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Active</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={v => setForm({ ...form, active: v })}
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-20 bg-card border-t px-5 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="h-9 flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="h-9 flex-1 sm:flex-none"
              >
                {editingGw ? "Update Gateway" : "Create Gateway"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Gateway?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-3">
            Are you sure you want to delete{" "}
            <strong>{gateways.find(g => g.id === deleteConfirm)?.name || "this gateway"}</strong>?
          </p>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}