
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Subscription, Order, Address, PaymentMethod } from "@/types/models";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import ProfileInfo from "@/components/profile/ProfileInfo";
import SubscriptionsList from "@/components/profile/SubscriptionsList";
import OrderHistory from "@/components/profile/OrderHistory";
import AddressList from "@/components/profile/AddressList";
import PaymentMethodList from "@/components/profile/PaymentMethodList";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userData = {
    fullName: "Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "+91 9876543210"
  };
  
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userMobile");
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to home page
    navigate("/");
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4">Sign in to view your profile</h1>
            <p className="text-gray-600 mb-6">
              Please login to access your profile, subscriptions, and order history.
            </p>
            <Link to="/login">
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 overflow-y-auto pb-20 md:pb-0">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        
        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className={`border-b w-full rounded-none justify-start gap-4 bg-transparent pb-0 ${isMobile ? "overflow-x-auto flex" : ""}`}>
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
          
          <div className="overflow-y-auto">
            <TabsContent value="profile" className="animate-in fade-in-50">
              <ProfileInfo initialData={userData} onLogout={handleLogout} />
            </TabsContent>
            
            <TabsContent value="subscriptions" className="animate-in fade-in-50">
              <SubscriptionsList subscriptions={sampleSubscriptions} />
            </TabsContent>
            
            <TabsContent value="orders" className="animate-in fade-in-50">
              <OrderHistory orders={sampleOrders} />
            </TabsContent>
            
            <TabsContent value="addresses" className="animate-in fade-in-50">
              <AddressList addresses={sampleAddresses} />
            </TabsContent>
            
            <TabsContent value="payment" className="animate-in fade-in-50">
              <PaymentMethodList paymentMethods={samplePaymentMethods} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
