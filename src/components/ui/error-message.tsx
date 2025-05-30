import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

export function ErrorMessage({ 
  message, 
  className,
  ...props 
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-destructive text-sm p-3 rounded-md bg-destructive/10",
        className
      )}
      {...props}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}