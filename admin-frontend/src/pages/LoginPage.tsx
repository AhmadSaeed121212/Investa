import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // Email validation
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  // Password validation
  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  // Form validation
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    const newErrors = {
      email: emailError,
      password: passwordError,
      general: ""
    };
    
    setErrors(newErrors);
    return !emailError && !passwordError;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await api.login(email, password);
      if (res.data.user.role !== "admin") throw new Error("Admin account required");
      login(res.data.token);
      toast.success("Login successful! Welcome to InvestMaster Admin Dashboard");
      navigate("/");
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear email error when user types
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // Clear password error when user types
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">InvestMaster</h1>
          <p className="text-muted-foreground mt-2">Admin Dashboard</p>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* General Error Message */}
              {errors.general && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <span className="text-sm text-destructive">{errors.general}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@investmaster.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`pl-10 h-11 bg-background/50 border ${
                      errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 h-11 bg-background/50 border ${
                      errors.password ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-medium">Demo Credentials:</span>
                <br />
                Email: <span className="text-foreground font-mono">admin@investmaster.com</span>
                <br />
                Password: <span className="text-foreground font-mono">admin123</span>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Secure admin access to InvestMaster platform
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}