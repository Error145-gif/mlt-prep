import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Edit, Tag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Id } from "@/convex/_generated/dataModel";

export default function CouponManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const coupons = useQuery(
    api.coupons.getAllCoupons,
    !isLoading && isAuthenticated && user?.role === "admin" ? {} : "skip"
  );
  const createCoupon = useMutation(api.coupons.createCoupon);
  const updateCoupon = useMutation(api.coupons.updateCoupon);
  const deleteCoupon = useMutation(api.coupons.deleteCoupon);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    usageLimit: undefined as number | undefined,
    expiryDate: undefined as number | undefined,
    description: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/auth" />;
  }

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || newCoupon.discountValue <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createCoupon({
        code: newCoupon.code,
        discountType: newCoupon.discountType,
        discountValue: newCoupon.discountValue,
        usageLimit: newCoupon.usageLimit,
        expiryDate: newCoupon.expiryDate,
        description: newCoupon.description || undefined,
      });
      toast.success("Coupon created successfully!");
      setIsCreateDialogOpen(false);
      setNewCoupon({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        usageLimit: undefined,
        expiryDate: undefined,
        description: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create coupon");
    }
  };

  const handleToggleActive = async (couponId: Id<"coupons">, currentStatus: boolean) => {
    try {
      await updateCoupon({
        couponId,
        isActive: !currentStatus,
      });
      toast.success(`Coupon ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update coupon");
    }
  };

  const handleDeleteCoupon = async (couponId: Id<"coupons">) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCoupon({ couponId });
      toast.success("Coupon deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
      
      {/* Animated orbs */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl"
        animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }}
      />

      {/* Lab background image */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <AdminSidebar />
        <div className="lg:ml-64 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Coupon Management</h1>
              <p className="text-white/70 mt-1">Create and manage discount coupons</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Coupon</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code">Coupon Code *</Label>
                    <Input
                      id="code"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., SAVE20"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountType">Discount Type *</Label>
                    <Select
                      value={newCoupon.discountType}
                      onValueChange={(value: "percentage" | "fixed") => setNewCoupon({ ...newCoupon, discountType: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        <SelectItem value="percentage" className="text-white">Percentage (%)</SelectItem>
                        <SelectItem value="fixed" className="text-white">Fixed Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discountValue">
                      Discount Value * {newCoupon.discountType === "percentage" ? "(%)" : "(₹)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={newCoupon.discountValue || ""}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) || 0 })}
                      placeholder={newCoupon.discountType === "percentage" ? "e.g., 20" : "e.g., 50"}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={newCoupon.usageLimit || ""}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Leave empty for unlimited"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value ? new Date(e.target.value).getTime() : undefined })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                      placeholder="e.g., New Year Special"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button onClick={handleCreateCoupon} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                    Create Coupon
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!coupons || coupons.length === 0 ? (
              <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20 col-span-full">
                <CardContent className="py-12 text-center">
                  <Tag className="h-12 w-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white/80">No coupons created yet</p>
                </CardContent>
              </Card>
            ) : (
              coupons.map((coupon, index) => (
                <motion.div
                  key={coupon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Tag className="h-5 w-5" />
                          {coupon.code}
                        </CardTitle>
                        <Badge className={coupon.isActive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-2xl font-bold text-white">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF
                      </div>
                      {coupon.description && (
                        <p className="text-white/70 text-sm">{coupon.description}</p>
                      )}
                      <div className="space-y-2 text-sm text-white/70">
                        <div className="flex items-center justify-between">
                          <span>Used:</span>
                          <span className="text-white font-medium">
                            {coupon.usageCount || 0} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "times"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Type:</span>
                          <span className="text-white font-medium">
                            {coupon.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                          </span>
                        </div>
                        {coupon.expiryDate && (
                          <div className="flex items-center justify-between">
                            <span>Expires:</span>
                            <span className="text-white font-medium">
                              {new Date(coupon.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 flex-1">
                          <Switch
                            checked={coupon.isActive}
                            onCheckedChange={() => handleToggleActive(coupon._id, coupon.isActive)}
                          />
                          <span className="text-white/70 text-sm">Active</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
