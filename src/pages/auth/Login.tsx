
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
    
    // Simulating OTP sending for now
    setTimeout(() => {
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your mobile number",
      });
      setIsLoading(false);
      setShowOTPInput(true);
    }, 1000);
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
      // Store authentication state in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userMobile", mobileNumber);
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Complete loading state before navigation
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to home page after authentication is set
        navigate("/");
      }, 500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    // When skipping, no authentication is set
    // Just navigate to home page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">MalaFlow</h1>
          <p className="text-gray-600">
            {showOTPInput ? "Verify Your Mobile Number" : "Sign in to your account"}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          {!showOTPInput ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="block text-center mb-2">
                  Enter 6-digit code sent to {mobileNumber}
                </Label>
                <div className="flex justify-center mb-4">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                <div className="text-center text-sm">
                  <button 
                    type="button" 
                    className="text-gray-600 hover:underline" 
                    onClick={() => setShowOTPInput(false)}
                    disabled={isLoading}
                  >
                    Change mobile number
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="font-medium hover:underline">
              Register
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-black" 
            onClick={handleSkip}
            type="button"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
