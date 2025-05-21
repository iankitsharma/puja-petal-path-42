
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PenSquare, Info, FileText, ShieldOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface ProfileInfoProps {
  initialData: {
    fullName: string;
    email: string;
    phone: string;
  };
  onLogout: () => void;
}

const ProfileInfo = ({ initialData, onLogout }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialData);
  const [editedData, setEditedData] = useState(userData);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
    });
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Personal Information */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
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
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
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
      
      {/* Additional Information Sections */}
      <div className="space-y-4">
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={18} />
                  <CardTitle className="text-lg">Contact Us</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <p>We're here to help with any questions or concerns you might have about our products or services.</p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> support@malaflow.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST</p>
                </div>
                <Button variant="outline" className="mt-2">Send us a message</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>

        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={18} />
                  <CardTitle className="text-lg">Privacy Policy</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Last updated: May 15, 2025</p>
                <p>At MalaFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                <h4 className="font-medium mt-3">Information We Collect</h4>
                <p>We collect personal information such as your name, email address, phone number, and delivery address when you create an account or place an order.</p>
                <h4 className="font-medium mt-3">How We Use Your Information</h4>
                <p>We use your information to process orders, provide customer service, and send you updates about your orders and our products.</p>
                <Button variant="outline" className="mt-2">Read Full Policy</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>

        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <CardTitle className="text-lg">Terms and Conditions</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Last updated: May 15, 2025</p>
                <p>By using our website and services, you agree to these Terms and Conditions. Please read them carefully.</p>
                <h4 className="font-medium mt-3">Acceptance of Terms</h4>
                <p>By accessing or using our services, you agree to be bound by these Terms and all applicable laws and regulations.</p>
                <h4 className="font-medium mt-3">Changes to Terms</h4>
                <p>We reserve the right to modify these Terms at any time. Your continued use of our services following any changes constitutes your acceptance of those changes.</p>
                <Button variant="outline" className="mt-2">Read Full Terms</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>

        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldOff size={18} />
                  <CardTitle className="text-lg">Refund and Cancellation</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Cancellation Policy</h4>
                <p>You can cancel a subscription at any time. Cancellations will take effect from the next billing cycle.</p>
                <h4 className="font-medium mt-3">Refund Policy</h4>
                <p>If you're not satisfied with our products, you can request a refund within 7 days of delivery. Please contact our customer support team with your order details.</p>
                <h4 className="font-medium mt-3">Non-Refundable Items</h4>
                <p>Personalized or custom items cannot be refunded unless there's a manufacturing defect.</p>
                <Button variant="outline" className="mt-2">Read Full Policy</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </div>
      
      {/* Logout button at bottom of profile */}
      <Button 
        variant="outline" 
        onClick={onLogout} 
        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Logout
      </Button>
    </div>
  );
};

export default ProfileInfo;
