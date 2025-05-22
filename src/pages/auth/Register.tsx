
import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"details" | "phoneOTP" | "success">("details");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendPhoneOTP = async () => {
    if (!phone || phone.length !== 10) {
      toast({
        title: "Phone number required",
        description: "Please enter your 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format phone with country code
      const formattedPhone = `+91${phone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true
        }
      });
      
      if (error) throw error;

      setPhoneOTP("");
      setCountdown(30);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone",
      });
      setStep("phoneOTP");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (phoneOTP.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format phone with country code
      const formattedPhone = `+91${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: phoneOTP,
        type: 'sms'
      });
      
      if (error) throw error;

      // After successful verification, create or update user profile
      await createUserProfile(data.user?.id);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive",
      });
    }
  };

  const createUserProfile = async (userId?: string) => {
    if (!userId) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format phone with country code
      const formattedPhone = `+91${phone}`;
      
      // Insert user profile
      const { error } = await supabase.from('users_profile').insert({
        id: userId,
        phone: formattedPhone,
        email: email || null,
        full_name: fullName
      });
      
      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "Welcome to MalaFlow! You've successfully registered.",
      });
      
      setStep("success");
      
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDetails = (e: FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    handleSendPhoneOTP();
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case "details":
        return (
          <form onSubmit={handleSubmitDetails} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-5 w-5 mr-2">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Sign up with Google
              </Button>
          </form>
        );
        
      case "phoneOTP":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Phone Verification</h3>
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to {phone}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneOTP">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={phoneOTP}
                  onChange={(value) => setPhoneOTP(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                type="button" 
                variant="link"
                onClick={handleSendPhoneOTP}
                disabled={countdown > 0 || isLoading}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </Button>
            </div>
            
            <Button
              type="button"
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handleVerifyPhoneOTP}
              disabled={isLoading || phoneOTP.length !== 6}
            >
              {isLoading ? "Verifying..." : "Complete Registration"}
            </Button>
          </div>
        );
        
      case "success":
        return (
          <div className="space-y-6 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium">Registration Successful</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your account has been created successfully!
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                className="flex-1 bg-black text-white hover:bg-gray-800"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
              <Button
                type="button"
                className="flex-1 border border-black bg-white text-black hover:bg-gray-100"
                onClick={() => navigate("/")}
              >
                Explore Shop
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white animate-fade-in py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">MalaFlow</h1>
          <p className="text-gray-600">
            {step === "details" ? "Create a new account" : 
             step === "phoneOTP" ? "Verify your phone number" : 
             "Welcome to MalaFlow"}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          {renderStep()}
          
          {step === "details" && (
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="font-medium hover:underline">
                Login
              </Link>
            </div>
          )}
          
          {step === "phoneOTP" && (
            <div className="mt-6 text-center text-sm">
              <Button 
                type="button" 
                variant="link" 
                className="font-medium"
                onClick={() => setStep("details")}
                disabled={isLoading}
              >
                Go back to details
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
