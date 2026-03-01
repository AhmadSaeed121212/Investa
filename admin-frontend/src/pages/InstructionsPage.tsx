import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Edit3, Check, X, AlertCircle, Info, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function InstructionsPage() {
  const [depositInstructions, setDepositInstructions] = useState(
    localStorage.getItem("depositInstructions") || 
    `1. Login to your account
2. Navigate to the Deposit section
3. Select your preferred payment method
4. Enter the deposit amount
5. Follow the payment gateway instructions
6. Your deposit will be processed within 24 hours`
  );
  
  const [withdrawInstructions, setWithdrawInstructions] = useState(
    localStorage.getItem("withdrawInstructions") || 
    `1. Login to your account
2. Navigate to the Withdraw section
3. Enter your withdrawal amount
4. Provide your wallet address or bank details
5. Submit your withdrawal request
6. Withdrawals are processed within 48 hours`
  );
  
  const [isEditingDeposit, setIsEditingDeposit] = useState(false);
  const [isEditingWithdraw, setIsEditingWithdraw] = useState(false);
  const [tempDeposit, setTempDeposit] = useState(depositInstructions);
  const [tempWithdraw, setTempWithdraw] = useState(withdrawInstructions);

  const handleSaveDeposit = () => {
    localStorage.setItem("depositInstructions", tempDeposit);
    setDepositInstructions(tempDeposit);
    setIsEditingDeposit(false);
    toast.success("Deposit instructions saved successfully!");
  };

  const handleSaveWithdraw = () => {
    localStorage.setItem("withdrawInstructions", tempWithdraw);
    setWithdrawInstructions(tempWithdraw);
    setIsEditingWithdraw(false);
    toast.success("Withdrawal instructions saved successfully!");
  };

  const handleCancelDeposit = () => {
    setTempDeposit(depositInstructions);
    setIsEditingDeposit(false);
  };

  const handleCancelWithdraw = () => {
    setTempWithdraw(withdrawInstructions);
    setIsEditingWithdraw(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Instructions Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage deposit and withdrawal instructions for users
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ArrowDownCircle className="h-5 w-5 text-primary" />
                    </div>
                    Deposit Instructions
                  </CardTitle>
                  <CardDescription>
                    Instructions for users to make deposits
                  </CardDescription>
                </div>
                {!isEditingDeposit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingDeposit(true);
                      setTempDeposit(depositInstructions);
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelDeposit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveDeposit}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingDeposit ? (
                <Textarea
                  value={tempDeposit}
                  onChange={(e) => setTempDeposit(e.target.value)}
                  className="min-h-[200px] bg-background/50 border-border focus:border-primary"
                  placeholder="Enter deposit instructions..."
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-foreground font-sans text-sm leading-relaxed">
                    {depositInstructions}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdrawal Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ArrowUpCircle className="h-5 w-5 text-primary" />
                    </div>
                    Withdrawal Instructions
                  </CardTitle>
                  <CardDescription>
                    Instructions for users to make withdrawals
                  </CardDescription>
                </div>
                {!isEditingWithdraw ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingWithdraw(true);
                      setTempWithdraw(withdrawInstructions);
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelWithdraw}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveWithdraw}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingWithdraw ? (
                <Textarea
                  value={tempWithdraw}
                  onChange={(e) => setTempWithdraw(e.target.value)}
                  className="min-h-[200px] bg-background/50 border-border focus:border-primary"
                  placeholder="Enter withdrawal instructions..."
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-foreground font-sans text-sm leading-relaxed">
                    {withdrawInstructions}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Info className="h-5 w-5" />
              Important Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-warning/90">
              These instructions will be saved locally in your browser. Changes will persist 
              until you clear your browser data. For production use, consider implementing 
              a backend API to store these instructions.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}