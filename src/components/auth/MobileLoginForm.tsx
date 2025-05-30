
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MobileLoginFormProps {
  mobileNumber: string;
  setMobileNumber: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
}

export const MobileLoginForm = ({ 
  mobileNumber, 
  setMobileNumber, 
  isLoading, 
  onSubmit 
}: MobileLoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  );
};
