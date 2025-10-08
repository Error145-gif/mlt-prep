import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SubscriptionManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const subscriptions = useQuery(
    api.subscriptions.getAllSubscriptions,
    activeTab === "all" ? {} : { status: activeTab }
  );
  const payments = useQuery(api.subscriptions.getPaymentHistory, {});

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
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Subscription & Payments</h1>

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
                            {new Date(sub.endDate).toLocaleDateString()}
                          </p>
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
