
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AuthErrorHandlerProps {
  onRetry?: () => void;
}

export const AuthErrorHandler = ({ onRetry }: AuthErrorHandlerProps) => {
  const { error, clearError } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleRetry = () => {
    clearError();
    if (onRetry) {
      onRetry();
    }
  };

  if (!error) return null;

  return (
    <div className="mt-4 w-full">
      <ErrorMessage message={error} />
      <Button 
        onClick={handleRetry}
        variant="outline"
        className="mt-2 w-full"
      >
        Try Again
      </Button>
    </div>
  );
};
