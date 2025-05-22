
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const checkAuth = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
      });
      navigate("/login");
      return false;
    }
    
    return true;
  };

  return checkAuth;
};
