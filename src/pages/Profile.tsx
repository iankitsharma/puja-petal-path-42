
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Subscription, Order, Address, PaymentMethod } from "@/types/models";
import { CheckCircle, XCircle, Clock, CreditCard, MapPin, PenSquare } from "lucide-react";

// Sample data
const sampleSubscriptions: Subscription[] = [
  {
    id: "1",
    user_id: "user1",
    created_at: "2023-05-01T10:00:00Z",
    status: "active",
    delivery_slot: "morning",
    frequency: "daily",
    duration: "1_month",
    start_date: "2023-05-02",
    end_date: "2023-06-02",
    next_delivery_date: "2023-05-15",
    address_id: "addr1",
    payment_method_id: "pm1",
    total_cost: 1350
  },
  {
    id: "2",
    user_id: "user1",
    created_at: "2023-04-15T11:30:00Z",
    status: "paused",
    delivery_slot: "evening",
    frequency: "weekly",
    selected_days: ["Monday", "Wednesday", "Friday"],
    duration: "1_month",
    start_date: "2023-04-16",
    end_date: "2023-05-16",
    next_delivery_date: "2023-05-17",
    address_id: "addr1",
    payment_method_id: "pm1",
    total_cost: 900
  }
];

const sampleOrders: Order[] = [
  {
    id: "1",
    user_id: "user1",
    created_at: "2023-05-10T15:30:00Z",
    status: "delivered",
    subtotal: 180,
    delivery_fee: 0,
    total: 180,
    address_id: "addr1",
    payment_method_id: "pm1",
    delivery_time: "morning"
  },
  {
    id: "2",
    user_id: "user1",
    created_at: "2023-05-05T12:45:00Z",
    status: "processing",
    subtotal: 130,
    delivery_fee: 49,
    total: 179,
    address_id: "addr1",
    payment_method_id: "pm1",
    delivery_time: "evening"
  }
];

const sampleAddresses: Address[] = [
  {
    id: "addr1",
    user_id: "user1",
    address_line1: "123 Puja Lane",
    address_line2: "Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001",
    landmark: "Near Shiva Temple",
    is_default: true,
    address_type: "home"
  },
  {
    id: "addr2",
    user_id: "user1",
    address_line1: "456 Devotion Street",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400002",
    is_default: false,
    address_type: "work"
  }
];

const samplePaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    user_id: "user1",
    type: "card",
    details: {
      last4: "4242",
      brand: "Visa",
      exp_month: 12,
      exp_year: 2025
    },
    is_default: true
  },
  {
    id: "pm2",
    user_id: "user1",
    type: "upi",
    details: {
      id: "user@bank"
    },
    is_default: false
  }
];

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [userData, setUserData] = useState({
    fullName: "Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "+91 9876543210"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const { toast } = useToast();
  
  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
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
      default:
        return <span>{status}</span>;
    }
  };
  
  const handleControlSubscription = (subscriptionId: string, action: string) => {
    toast({
      title: `Subscription ${action}d`,
      description: `Your subscription has been ${action}d successfully`,
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    toast({
      title: "Address updated",
      description: "Default address has been updated",
    });
  };
  
  const handleSetDefaultPayment = (paymentId: string) => {
    toast({
      title: "Payment method updated",
      description: "Default payment method has been updated",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        
        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="border-b w-full rounded-none justify-start gap-4 bg-transparent pb-0">
            <TabsTrigger 
              value="profile" 
              className={`rounded-none border-b-2 border-transparent pb-2 font-medium ${
                selectedTab === "profile" ? "border-black" : ""
              }`}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="subscriptions" 
              className={`rounded-none border-b-2 border-transparent pb-2 font-medium ${
                selectedTab === "subscriptions" ? "border-black" : ""
              }`}
            >
              Subscriptions
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className={`rounded-none border-b-2 border-transparent pb-2 font-medium ${
                selectedTab === "orders" ? "border-black" : ""
              }`}
            >
              Order History
            </TabsTrigger>
            <TabsTrigger 
              value="addresses" 
              className={`rounded-none border-b-2 border-transparent pb-2 font-medium ${
                selectedTab === "addresses" ? "border-black" : ""
              }`}
            >
              Addresses
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className={`rounded-none border-b-2 border-transparent pb-2 font-medium ${
                selectedTab === "payment" ? "border-black" : ""
              }`}
            >
              Payment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="animate-in">
            <div className="max-w-md mx-auto md:mx-0">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Personal Information</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center"
                  >
                    <PenSquare size={16} className="mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={editedData.fullName}
                        onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedData.phone}
                        onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                      />
                    </div>
                    
                    <Button 
                      className="bg-black text-white hover:bg-gray-800 w-full"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-sm">Full Name</Label>
                      <p className="font-medium">{userData.fullName}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-sm">Email</Label>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-sm">Phone</Label>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="animate-in">
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Your Subscriptions</h2>
              
              {sampleSubscriptions.length > 0 ? (
                <div className="space-y-4">
                  {sampleSubscriptions.map((subscription) => (
                    <div 
                      key={subscription.id} 
                      className="border border-gray-200 rounded-lg p-6"
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
          </TabsContent>
          
          <TabsContent value="orders" className="animate-in">
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Order History</h2>
              
              {sampleOrders.length > 0 ? (
                <div className="space-y-6">
                  {sampleOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-gray-200 rounded-lg p-6"
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
          </TabsContent>
          
          <TabsContent value="addresses" className="animate-in">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Saved Addresses</h2>
                <Button className="bg-black text-white hover:bg-gray-800">
                  Add New Address
                </Button>
              </div>
              
              {sampleAddresses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {sampleAddresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-5 relative ${address.is_default ? 'border-black' : 'border-gray-200'}`}
                    >
                      {address.is_default && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-black text-white text-xs py-1 px-2 rounded-full">
                            Default
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start mb-4">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {address.address_line1}
                            {address.address_line2 && <span>, {address.address_line2}</span>}
                            <br />
                            {address.city}, {address.state} {address.postal_code}
                            {address.landmark && <span><br />Landmark: {address.landmark}</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs border-black hover:bg-gray-50">
                          Edit
                        </Button>
                        
                        {!address.is_default && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs border-black hover:bg-gray-50"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 mb-4">You haven't saved any addresses yet</p>
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Add New Address
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="animate-in">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Saved Payment Methods</h2>
                <Button className="bg-black text-white hover:bg-gray-800">
                  Add New Payment Method
                </Button>
              </div>
              
              {samplePaymentMethods.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {samplePaymentMethods.map((payment) => (
                    <div 
                      key={payment.id} 
                      className={`border rounded-lg p-5 relative ${payment.is_default ? 'border-black' : 'border-gray-200'}`}
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
