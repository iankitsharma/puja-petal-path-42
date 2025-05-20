
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuth = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuthenticated) {
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
