import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SeoPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">SEO Settings</h2>
        <p className="text-sm text-muted-foreground">Optimize your website for search engines</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
        <div><Label>Meta Title</Label><Input defaultValue="InvestPro - Smart Investment Platform" className="mt-1" /></div>
        <div><Label>Meta Description</Label><Textarea defaultValue="Invest smartly with InvestPro. Earn daily profits with our secure investment plans." className="mt-1" rows={3} /></div>
        <div><Label>Meta Keywords</Label><Input defaultValue="investment, profit, referral, trading" className="mt-1" /></div>
        <div><Label>Social Title</Label><Input defaultValue="InvestPro - Start Earning Today" className="mt-1" /></div>
        <div><Label>Social Description</Label><Textarea defaultValue="Join thousands of investors earning daily profits." className="mt-1" rows={2} /></div>
        <div>
          <Label>OG Image</Label>
          <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">Upload Open Graph image (1200x630)</p>
          </div>
        </div>
        <div><Label>Google Analytics Code</Label><Input placeholder="UA-XXXXX or G-XXXXX" className="mt-1" /></div>
        <Button>Save SEO Settings</Button>
      </motion.div>
    </div>
  );
}
