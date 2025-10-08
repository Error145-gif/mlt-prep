import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, MapPin, BookOpen, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Scientist",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Technician",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Medic",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurse",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=LabTech",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Analyst",
];

const EXAM_OPTIONS = [
  "RRB Section Officer",
  "AIIMS MLT",
  "ESIC MLT",
  "Railway MLT",
  "State MLT Exams",
  "JIPMER MLT",
  "PGIMER MLT",
  "Other",
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function Profile() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const userProfile = useQuery(api.users.getUserProfile);
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [examPreparation, setExamPreparation] = useState("");
  const [state, setState] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setSelectedAvatar(userProfile.avatarUrl || AVATAR_OPTIONS[0]);
      setExamPreparation(userProfile.examPreparation || "");
      setState(userProfile.state || "");
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!name || name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name,
        avatarUrl: selectedAvatar,
        examPreparation: examPreparation || undefined,
        state: state || undefined,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    if (name) completed += 25;
    if (selectedAvatar) completed += 25;
    if (examPreparation) completed += 25;
    if (state) completed += 25;
    return completed;
  };

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white/70 mt-1">Manage your personal information</p>
        </motion.div>

        {/* Profile Completion */}
        {completion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-blue-500/50 backdrop-blur-xl bg-blue-500/10 p-4 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Profile Completion</span>
              <span className="text-white font-bold">{completion}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Current Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">Current Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white/20">
                <AvatarImage src={selectedAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-white">{name || "No name set"}</h3>
                <p className="text-white/70 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {userProfile.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                {name && name.length < 2 && (
                  <p className="text-red-400 text-sm">Name must be at least 2 characters</p>
                )}
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <Label className="text-white">Select Avatar</Label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {AVATAR_OPTIONS.map((avatar, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative cursor-pointer rounded-full ${
                        selectedAvatar === avatar ? "ring-4 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      <Avatar className="h-16 w-16 border-2 border-white/20">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>A{index + 1}</AvatarFallback>
                      </Avatar>
                      {selectedAvatar === avatar && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Exam Preparation */}
              <div className="space-y-2">
                <Label htmlFor="exam" className="text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Exam Preparation
                </Label>
                <Select value={examPreparation} onValueChange={setExamPreparation}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12">
                    <SelectValue placeholder="Select exam you're preparing for" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/30">
                    {EXAM_OPTIONS.map((exam) => (
                      <SelectItem key={exam} value={exam} className="text-white hover:bg-white/10 focus:bg-white/20">
                        {exam}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State Selection */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  State
                </Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/30 max-h-[300px]">
                    {INDIAN_STATES.map((stateName) => (
                      <SelectItem key={stateName} value={stateName} className="text-white hover:bg-white/10 focus:bg-white/20">
                        {stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving || !name || name.length < 2}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}