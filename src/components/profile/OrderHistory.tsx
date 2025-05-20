
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/models";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory = ({ orders }: OrderHistoryProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-1" />
            <span className="text-sm">Delivered</span>
          </div>
        );
      case "processing":
        return (
          <div className="flex items-center text-blue-600">
            <Clock size={16} className="mr-1" />
            <span className="text-sm">Processing</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-amber-600">
            <Clock size={16} className="mr-1" />
            <span className="text-sm">Pending</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center text-red-600">
            <XCircle size={16} className="mr-1" />
            <span className="text-sm">Cancelled</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Order History</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium mr-3">
                      Order #{order.id}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 text-right">
                  <p className="font-medium">₹{order.total}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Delivery: {order.delivery_time === 'morning' ? 'Morning (6 AM - 9 AM)' : 'Evening (4 PM - 7 PM)'}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="text-sm border-black hover:bg-gray-50"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Button className="bg-black text-white hover:bg-gray-800">
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
