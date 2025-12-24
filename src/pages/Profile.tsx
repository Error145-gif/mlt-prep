// @ts-nocheck
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
import { User, Mail, Globe, MapPin, BookOpen, Check, Camera, Upload, Lock, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=LabTech",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Medic",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Technician",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Scientist",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Analyst",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurse",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
];

const EXAM_OPTIONS = [
  { category: "🇮🇳 INDIA – CENTRAL / NATIONAL", exams: [
    "AIIMS Lab Technician",
    "PGI Chandigarh Lab Technician",
    "DSSSB Lab Technician",
    "RRB Lab Technician",
    "CCRH Lab Technician",
  ]},
  { category: "🏥 UNIVERSITY / INSTITUTE", exams: [
    "Baba Farid University of Health Sciences (BFUHS)",
    "Other University / Institute Exams",
  ]},
  { category: "🏛 STATE LEVEL", exams: [
    "State Level Lab Technician Exam",
  ]},
  { category: "🌍 INTERNATIONAL", exams: [
    "International Lab Technician Exam (Outside India)",
  ]},
  { category: "🔹 GENERAL", exams: [
    "Other MLT Exams",
  ]},
];

const EXAM_YEARS = ["2025", "2026"];
const EXAM_ATTEMPTS = ["First Attempt", "Repeat Attempt"];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "UAE",
  "Saudi Arabia",
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
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const userProfile = useQuery(api.users.getUserProfile);
  const updateProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const saveProfileImage = useMutation(api.users.saveProfileImage);

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [examPreparation, setExamPreparation] = useState("");
  const [examYear, setExamYear] = useState("");
  const [examAttempt, setExamAttempt] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Password management state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSettingPassword, setIsSettingPassword] = useState(false);

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
      // Set default country if not set
      if (!country && userProfile.state) {
        setCountry("India");
      }
    }
  }, [userProfile]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const imageUrl = await saveProfileImage({ storageId });
      setSelectedAvatar(imageUrl);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (!examPreparation) {
      toast.error("Please select your target exam");
      return;
    }

    if (!country) {
      toast.error("Please select your country");
      return;
    }

    if (country === "India" && !state) {
      toast.error("Please select your state");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name,
        avatarUrl: selectedAvatar,
        examPreparation: examPreparation || undefined,
        state: country === "India" ? state : undefined,
      });
      toast.success("Profile saved successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsSettingPassword(true);
    try {
      // Use signUp flow to add/update password credential for the authenticated user
      // This attaches the password to the existing account
      await signIn("password", { 
        flow: "signUp", 
        email: userProfile?.email, 
        password: newPassword 
      });
      
      toast.success("Password set successfully! You can now login with email and password.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to set password:", error);
      toast.error("Failed to set password. " + (error instanceof Error ? error.message : "Please try again."));
    } finally {
      setIsSettingPassword(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    if (name) completed += 20;
    if (selectedAvatar) completed += 20;
    if (examPreparation) completed += 30;
    if (country) completed += 15;
    if (country !== "India" || state) completed += 15;
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
      <StudentNav />
      
      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 -z-10 opacity-15"
        style={{
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/27dfb36c-ac7c-4a7c-930b-57ef6b7163d1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-white/80 mt-1">This helps us personalize tests and practice for your exam.</p>
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

        {/* Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">Profile Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                {name && name.length < 2 && (
                  <p className="text-red-400 text-sm">Name must be at least 2 characters</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={userProfile.email || ""}
                  disabled
                  className="bg-white/5 border-white/10 text-white/70 cursor-not-allowed"
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Profile Avatar
                </Label>
                
                {/* Upload Custom Image */}
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload Custom Image"}
                  </Label>
                  <span className="text-white/70 text-sm">Max 5MB</span>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
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

              {/* Target Exam */}
              <div className="space-y-2">
                <Label htmlFor="exam" className="text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Target Exam *
                </Label>
                <Select value={examPreparation} onValueChange={setExamPreparation}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12">
                    <SelectValue placeholder="Select your target exam" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/30 max-h-[400px]">
                    {EXAM_OPTIONS.map((group) => (
                      <div key={group.category}>
                        <div className="px-2 py-2 text-xs font-semibold text-white/50 uppercase tracking-wide">
                          {group.category}
                        </div>
                        {group.exams.map((exam) => (
                          <SelectItem 
                            key={exam} 
                            value={exam} 
                            className="text-white hover:bg-white/10 focus:bg-white/20 pl-6"
                          >
                            {exam}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Year & Attempt */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white">
                    Exam Year
                  </Label>
                  <Select value={examYear} onValueChange={setExamYear}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/30">
                      {EXAM_YEARS.map((year) => (
                        <SelectItem key={year} value={year} className="text-white hover:bg-white/10 focus:bg-white/20">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attempt" className="text-white">
                    Attempt
                  </Label>
                  <Select value={examAttempt} onValueChange={setExamAttempt}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60">
                      <SelectValue placeholder="Select attempt" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/30">
                      {EXAM_ATTEMPTS.map((attempt) => (
                        <SelectItem key={attempt} value={attempt} className="text-white hover:bg-white/10 focus:bg-white/20">
                          {attempt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-white flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Country *
                </Label>
                <p className="text-white/60 text-xs mb-2">Used to show country-specific exam content</p>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/30">
                    {COUNTRIES.map((countryName) => (
                      <SelectItem key={countryName} value={countryName} className="text-white hover:bg-white/10 focus:bg-white/20">
                        {countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State Selection (Conditional) */}
              {country === "India" && (
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    State *
                  </Label>
                  <p className="text-white/60 text-xs mb-2">Used to show state-level questions</p>
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
              )}

              {/* Password Management Section */}
              <div className="space-y-2 border-t border-white/20 pt-6">
                <Label className="text-white flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Set Password
                </Label>
                <p className="text-white/60 text-xs mb-4">
                  Set a password to login with your email address.
                </p>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-white text-sm">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white text-sm">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleSetPassword}
                    disabled={isSettingPassword || !newPassword || !confirmPassword}
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  >
                    {isSettingPassword ? (
                      <>Setting Password...</>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4 mr-2" />
                        Set Password
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Helper Text */}
              <div className="flex items-center gap-2 text-white/80 text-sm bg-white/5 rounded-lg py-3 px-4 border border-white/10">
                <span>⏱</span>
                <span>Takes less than 1 minute</span>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving || !name || name.length < 2 || !examPreparation || !country || (country === "India" && !state) || isUploading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-base"
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