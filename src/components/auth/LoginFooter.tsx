
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoginFooterProps {
  onSkip: () => void;
}

export const LoginFooter = ({ onSkip }: LoginFooterProps) => {
  return (
    <>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="font-medium hover:underline">
          Register
        </Link>
      </div>

      <div className="mt-4 text-center">
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-black" 
          onClick={onSkip}
          type="button"
        >
          Skip for now
        </Button>
      </div>
    </>
  );
};
