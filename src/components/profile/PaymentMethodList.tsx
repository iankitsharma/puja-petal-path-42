
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/models";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
}

const PaymentMethodList = ({ paymentMethods }: PaymentMethodListProps) => {
  const { toast } = useToast();
  
  const handleSetDefaultPayment = (paymentId: string) => {
    toast({
      title: "Payment method updated",
      description: "Default payment method has been updated",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Saved Payment Methods</h2>
        <Button className="bg-black text-white hover:bg-gray-800">
          Add New Payment Method
        </Button>
      </div>
      
      {paymentMethods.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {paymentMethods.map((payment) => (
            <div 
              key={payment.id} 
              className={`border rounded-lg p-5 relative ${payment.is_default ? 'border-black shadow-sm' : 'border-gray-200'}`}
            >
              {payment.is_default && (
                <div className="absolute top-2 right-2">
                  <span className="bg-black text-white text-xs py-1 px-2 rounded-full">
                    Default
                  </span>
                </div>
              )}
              
              <div className="flex items-start mb-4">
                <CreditCard className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  {payment.type === 'card' && (
                    <>
                      <p className="font-medium">
                        {(payment.details as any).brand} •••• {(payment.details as any).last4}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        Expires {(payment.details as any).exp_month}/{(payment.details as any).exp_year}
                      </p>
                    </>
                  )}
                  
                  {payment.type === 'upi' && (
                    <p className="font-medium">
                      UPI ID: {(payment.details as any).id}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {!payment.is_default && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-black hover:bg-gray-50"
                    onClick={() => handleSetDefaultPayment(payment.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs text-red-600 border-red-600 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't saved any payment methods yet</p>
          <Button className="bg-black text-white hover:bg-gray-800">
            Add New Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodList;
