// @ts-nocheck
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate, useNavigate } from "react-router";
import { Loader2, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Manual activation state
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    email: "",
    planName: "Pro Plan",
    duration: "365",
    amount: "999"
  });
  
  const manualActivate = useMutation(api.subscriptions.manualActivateSubscription);

  const subscriptions = useQuery(
    api.subscriptions.getAllSubscriptions,
    activeTab === "all" ? {} : { status: activeTab }
  );
  const payments = useQuery(api.subscriptions.getPaymentHistory, {});

  const handleManualActivate = async () => {
    if (!manualForm.email) {
      toast.error("Please enter a user email");
      return;
    }

    try {
      await manualActivate({
        email: manualForm.email,
        planName: manualForm.planName,
        duration: parseInt(manualForm.duration),
        amount: parseInt(manualForm.amount)
      });
      toast.success(`Subscription activated for ${manualForm.email}`);
      setIsManualOpen(false);
      setManualForm({ email: "", planName: "Pro Plan", duration: "365", amount: "999" });
    } catch (error: any) {
      toast.error(error.message || "Failed to activate subscription");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/auth" />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Inactive</Badge>;
      case "expired":
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Expired</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 z-0" />
      
      {/* Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-white">Subscription & Payments</h1>
          </div>

          <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white border-none">
                <Plus className="h-4 w-4 mr-2" />
                Manual Activation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Manually Activate Subscription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input 
                    id="email" 
                    placeholder="user@example.com" 
                    value={manualForm.email}
                    onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plan Name</Label>
                    <Select 
                      value={manualForm.planName} 
                      onValueChange={(val) => setManualForm({...manualForm, planName: val})}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="Pro Plan">Pro Plan</SelectItem>
                        <SelectItem value="Basic Plan">Basic Plan</SelectItem>
                        <SelectItem value="Premium Plan">Premium Plan</SelectItem>
                        <SelectItem value="7-Day Free Trial">7-Day Free Trial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input 
                      id="amount" 
                      type="number"
                      value={manualForm.amount}
                      onChange={(e) => setManualForm({...manualForm, amount: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Select 
                    value={manualForm.duration} 
                    onValueChange={(val) => setManualForm({...manualForm, duration: val})}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days (1 Month)</SelectItem>
                      <SelectItem value="90">90 Days (3 Months)</SelectItem>
                      <SelectItem value="180">180 Days (6 Months)</SelectItem>
                      <SelectItem value="365">365 Days (1 Year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsManualOpen(false)} className="border-slate-700 text-white hover:bg-slate-800 hover:text-white">Cancel</Button>
                <Button onClick={handleManualActivate} className="bg-green-500 hover:bg-green-600 text-white">Activate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={() => { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={() => { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={() => { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={() => { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={() => { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={() => { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={() => { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={() => { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={() => { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-white/20">Active</TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-white/20">Inactive</TabsTrigger>
            <TabsTrigger value="expired" className="data-[state=active]:bg-white/20">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader>
                <CardTitle className="text-white">Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {!subscriptions || subscriptions.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No subscriptions found</p>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((sub: any) => (
                      <div
                        key={sub._id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div>
                          <p className="font-medium text-white">{sub.userName}</p>
                          <p className="text-sm text-white/60">{sub.userEmail}</p>
                          <p className="text-sm text-white/60 mt-1">{sub.planName}</p>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(sub.status)}
                          <p className="text-sm text-white/60">₹{sub.amount}</p>
                          <p className="text-xs text-white/40">
                            Expires: {new Date(sub.endDate).toLocaleDateString()}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-500/20"
                            onClick={() => {
                              setManualForm({
                                email: sub.userEmail,
                                planName: sub.planName,
                                duration: "365",
                                amount: sub.amount.toString()
                              });
                              setIsManualOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader>
                <CardTitle className="text-white">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {!payments || payments.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No payments found</p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment: any) => (
                      <div
                        key={payment._id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div>
                          <p className="font-medium text-white">{payment.userName}</p>
                          <p className="text-sm text-white/60">{payment.userEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">₹{payment.amount}</p>
                          <p className="text-sm text-white/60 capitalize">{payment.status}</p>
                          <p className="text-xs text-white/40">
                            {new Date(payment._creationTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}