
import { useState, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"details" | "phoneOTP" | "emailOTP" | "success">("details");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendPhoneOTP = () => {
    if (!phone) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP sending
    setIsLoading(true);
    setTimeout(() => {
      setPhoneOTPSent(true);
      setIsLoading(false);
      setCountdown(30);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone",
      });
      setStep("phoneOTP");
    }, 1000);
  };

  const handleSendEmailOTP = () => {
    // Simulate OTP sending
    setIsLoading(true);
    setTimeout(() => {
      setEmailOTPSent(true);
      setIsLoading(false);
      setCountdown(30);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email",
      });
      setStep("emailOTP");
    }, 1000);
  };

  const handleVerifyPhoneOTP = () => {
    if (phoneOTP.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (email) {
        handleSendEmailOTP();
      } else {
        completeRegistration();
      }
    }, 1000);
  };

  const handleVerifyEmailOTP = () => {
    if (emailOTP.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      completeRegistration();
    }, 1000);
  };

  const completeRegistration = () => {
    toast({
      title: "Registration Successful",
      description: "Welcome to MalaFlow! You've successfully registered.",
    });
    setStep("success");
    // Here you would typically redirect the user or update auth state
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
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              <p className="text-xs text-gray-500">
                If email is provided, email verification will be required
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
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
              {isLoading ? "Verifying..." : "Verify Phone"}
            </Button>
          </div>
        );
        
      case "emailOTP":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Email Verification</h3>
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailOTP">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={emailOTP}
                  onChange={(value) => setEmailOTP(value)}
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
                onClick={handleSendEmailOTP}
                disabled={countdown > 0 || isLoading}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </Button>
            </div>
            
            <Button
              type="button"
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handleVerifyEmailOTP}
              disabled={isLoading || emailOTP.length !== 6}
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
                onClick={() => window.location.href = "/login"}
              >
                Go to Login
              </Button>
              <Button
                type="button"
                className="flex-1 border border-black bg-white text-black hover:bg-gray-100"
                onClick={() => window.location.href = "/"}
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
             step === "emailOTP" ? "Verify your email" : "Welcome to MalaFlow"}
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
          
          {(step === "phoneOTP" || step === "emailOTP") && (
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
