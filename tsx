// ...
const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  const formData = new FormData(event.currentTarget);
  formData.set("flow", "reset-verification");
  
  await signIn("password", formData);
  toast.success("Password set successfully! You can now login.");
  setStep("signIn");
};

// ...
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);

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

  if (!userProfile?.email) {
    toast.error("User email not found");
    return;
  }
  
  setIsSettingPassword(true);
  try {
    if (!otpSent) {
      // Step 1: Send OTP using reset flow
      await signIn("password", { 
        flow: "reset", 
        email: userProfile.email 
      });
      setOtpSent(true);
      toast.success("Verification code sent to your email");
    } else {
      // Step 2: Verify OTP and set password
      await signIn("password", { 
        flow: "reset-verification", 
        email: userProfile.email,
        code: otp,
        password: newPassword 
      });
      
      toast.success("Password set successfully! You can now login with email and password.");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpSent(false);
    }
  } catch (error) {
    console.error("Failed to set password:", error);
    toast.error("Failed to set password. " + (error instanceof Error ? error.message : "Please try again."));
  } finally {
    setIsSettingPassword(false);
  }
};

// ...
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" ...>New Password</Label>
                      <Input ... />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" ...>Confirm Password</Label>
                      <Input ... />
                    </div>
                  </div>
                  
                  <Button onClick={handleSetPassword} ...>Set Password</Button>
// ...