
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/models";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionsListProps {
  subscriptions: Subscription[];
}

const SubscriptionsList = ({ subscriptions }: SubscriptionsListProps) => {
  const { toast } = useToast();
  
  const handleControlSubscription = (subscriptionId: string, action: string) => {
    toast({
      title: `Subscription ${action}d`,
      description: `Your subscription has been ${action}d successfully`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-1" />
            <span className="text-sm">Active</span>
          </div>
        );
      case "paused":
        return (
          <div className="flex items-center text-amber-600">
            <Clock size={16} className="mr-1" />
            <span className="text-sm">Paused</span>
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
      <h2 className="text-xl font-medium">Your Subscriptions</h2>
      
      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div 
              key={subscription.id} 
              className="border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium mr-3">
                      {subscription.frequency === 'daily' ? 'Daily' : 'Weekly'} Mala Delivery
                    </h3>
                    {getStatusBadge(subscription.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Delivery:</span>{' '}
                    {subscription.delivery_slot === 'morning' ? 'Morning (6 AM - 9 AM)' : 'Evening (4 PM - 7 PM)'}{' '}
                  </p>
                  
                  {subscription.frequency === 'weekly' && subscription.selected_days && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Days:</span>{' '}
                      {subscription.selected_days.join(', ')}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Period:</span>{' '}
                    {new Date(subscription.start_date).toLocaleDateString()} to {new Date(subscription.end_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 text-right">
                  <p className="font-medium">₹{subscription.total_cost}</p>
                  <p className="text-sm text-gray-600">
                    Next delivery: {new Date(subscription.next_delivery_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {subscription.status === 'active' && (
                  <Button 
                    variant="outline" 
                    className="text-sm border-black hover:bg-gray-50"
                    onClick={() => handleControlSubscription(subscription.id, 'pause')}
                  >
                    Pause Subscription
                  </Button>
                )}
                
                {subscription.status === 'paused' && (
                  <Button 
                    variant="outline" 
                    className="text-sm border-black hover:bg-gray-50"
                    onClick={() => handleControlSubscription(subscription.id, 'resume')}
                  >
                    Resume Subscription
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="text-sm text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleControlSubscription(subscription.id, 'cancel')}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">You don't have any active subscriptions</p>
          <Button className="bg-black text-white hover:bg-gray-800">
            Browse Subscription Options
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsList;
