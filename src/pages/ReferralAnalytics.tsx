import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Star, TrendingUp, DollarSign, Settings, AlertTriangle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ReferralAnalytics() {
  const overview = useQuery(api.referralAdmin.getReferralOverview);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [referrerEmail, setReferrerEmail] = useState("");
  const referredUsers = useQuery(api.referralAdmin.getAllReferredUsers, {
    status: statusFilter === "all" ? undefined : statusFilter,
    referrerEmail: referrerEmail || undefined,
  });
  const settings = useQuery(api.referralAdmin.getReferralSettings);
  const fraudLogs = useQuery(api.referralAdmin.getFraudLogs);

  const updateSettings = useMutation(api.referralAdmin.updateReferralSettings);

  const [settingsForm, setSettingsForm] = useState({
    starValueInRupees: 1,
    starsPerReferral: 20,
    maxStarsUsagePercent: 50,
    starExpiryDays: 90,
    isReferralEnabled: true,
    allowCouponWithStars: false,
    minPurchaseForReferral: 0,
  });

  const handleUpdateSettings = async () => {
    try {
      await updateSettings(settingsForm);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (!overview || !settings) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Referral Analytics</h1>
            <Badge variant={settings.isReferralEnabled ? "default" : "destructive"}>
              {settings.isReferralEnabled ? "Active" : "Disabled"}
            </Badge>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Total Links Generated</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{overview.totalLinksGenerated}</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Users Joined</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{overview.totalUsersJoined}</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Paid Users</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{overview.totalPaidUsers}</div>
                <p className="text-xs text-white/50">Conversion: {overview.conversionRate}%</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Stars Issued</CardTitle>
                <Star className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{overview.totalStarsIssued}</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Stars Redeemed</CardTitle>
                <Star className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{overview.totalStarsRedeemed}</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹{overview.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="glass-card border-white/20">
              <TabsTrigger value="users">Referred Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Logs</TabsTrigger>
            </TabsList>

            {/* Referred Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/70">Referrer Email</Label>
                      <Input
                        placeholder="Search by referrer email"
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Referred Users ({referredUsers?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {referredUsers?.map((ref: any) => (
                      <div key={ref._id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{ref.referredName}</p>
                            <p className="text-sm text-white/50">{ref.referredEmail}</p>
                            <p className="text-xs text-white/40">Referred by: {ref.referrerEmail}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={ref.status === "qualified" ? "default" : "secondary"}>
                              {ref.status}
                            </Badge>
                            {ref.isPaidUser && (
                              <p className="text-sm text-green-400 mt-1">₹{ref.amountPaid}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Referral Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Star Value (₹)</Label>
                      <Input
                        type="number"
                        value={settingsForm.starValueInRupees}
                        onChange={(e) => setSettingsForm({ ...settingsForm, starValueInRupees: Number(e.target.value) })}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Stars Per Referral</Label>
                      <Input
                        type="number"
                        value={settingsForm.starsPerReferral}
                        onChange={(e) => setSettingsForm({ ...settingsForm, starsPerReferral: Number(e.target.value) })}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Max Stars Usage (%)</Label>
                      <Input
                        type="number"
                        value={settingsForm.maxStarsUsagePercent}
                        onChange={(e) => setSettingsForm({ ...settingsForm, maxStarsUsagePercent: Number(e.target.value) })}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Star Expiry (Days)</Label>
                      <Input
                        type="number"
                        value={settingsForm.starExpiryDays}
                        onChange={(e) => setSettingsForm({ ...settingsForm, starExpiryDays: Number(e.target.value) })}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <Button onClick={handleUpdateSettings} className="w-full">
                    Update Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fraud Logs Tab */}
            <TabsContent value="fraud" className="space-y-4">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Fraud Detection Logs ({fraudLogs?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {fraudLogs?.map((log: any) => (
                      <div key={log._id} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{log.userName}</p>
                            <p className="text-sm text-white/50">{log.userEmail}</p>
                            <p className="text-xs text-red-400 mt-1">{log.fraudType}: {log.details}</p>
                          </div>
                          <Badge variant="destructive">{log.actionTaken}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
