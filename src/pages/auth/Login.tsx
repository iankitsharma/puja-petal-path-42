
import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthErrorHandler } from "@/components/AuthErrorHandler";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { MobileLoginForm } from "@/components/auth/MobileLoginForm";
import { OTPVerificationForm } from "@/components/auth/OTPVerificationForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginFooter } from "@/components/auth/LoginFooter";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInWithGoogle, session, error, isLoading: authLoading } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format phone with country code
      const formattedPhone = `+91${mobileNumber}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });
      
      if (error) throw error;
      
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your mobile number",
      });
      setShowOTPInput(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format phone with country code
      const formattedPhone = `+91${mobileNumber}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google sign-in from Login page");
      await signInWithGoogle();
      console.log("Google sign-in completed successfully");
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // Error handling is now done by AuthErrorHandler
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const handleChangeNumber = () => {
    setShowOTPInput(false);
    setOtp("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white animate-fade-in">
      <div className="w-full max-w-md">
        <LoginHeader showOTPInput={showOTPInput} />
        
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          {!showOTPInput ? (
            <>
              <MobileLoginForm
                mobileNumber={mobileNumber}
                setMobileNumber={setMobileNumber}
                isLoading={isLoading}
                onSubmit={handleSendOTP}
              />
              
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                isLoading={isLoading}
              />
              
              <AuthErrorHandler onRetry={handleGoogleSignIn} />
            </>
          ) : (
            <OTPVerificationForm
              mobileNumber={mobileNumber}
              otp={otp}
              setOtp={setOtp}
              isLoading={isLoading}
              onSubmit={handleVerifyOTP}
              onChangeNumber={handleChangeNumber}
            />
          )}
          
          <LoginFooter onSkip={handleSkip} />
        </div>
      </div>
    </div>
  );
};

export default Login;
