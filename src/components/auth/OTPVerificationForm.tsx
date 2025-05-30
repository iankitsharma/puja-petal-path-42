
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";

interface OTPVerificationFormProps {
  mobileNumber: string;
  otp: string;
  setOtp: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onChangeNumber: () => void;
}

export const OTPVerificationForm = ({ 
  mobileNumber, 
  otp, 
  setOtp, 
  isLoading, 
  onSubmit, 
  onChangeNumber 
}: OTPVerificationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onClick={onChangeNumber}
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
  );
};
